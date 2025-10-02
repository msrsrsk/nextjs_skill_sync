import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/clients/stripe/client"

import { sendSubscriptionPaymentRequestEmail } from "@/services/email/subscription/subscription-payment-request"
import { createSubscriptionPayment } from "@/services/subscription-payment/actions"
import { formatStripeSubscriptionStatus } from "@/lib/utils/format"
import { NOIMAGE_PRODUCT_IMAGE_URL, SUBSCRIPTION_STATUS } from "@/constants/index"

const { SUBS_ACTIVE } = SUBSCRIPTION_STATUS;

interface verifyWebhookSignature {
    request: NextRequest;
    endpointSecret: string;
    errorMessage: string;
}

interface CreateProductDetailsProps {
    lineItems: StripeCheckoutSessionLineItem[] | StripeSubscriptionItem[];
    subscriptionId: string;
    isCheckout: boolean;
}

// Webhookの署名の認証
export async function verifyWebhookSignature({
    request,
    endpointSecret,
    errorMessage
}: verifyWebhookSignature) {
    const signature = headers().get(process.env.STRIPE_SIGNATURE_HEADER as string);

    if (!signature || !endpointSecret) {
        if (!signature) console.error('Stripe signature not found');
        if (!endpointSecret) console.error('Stripe endpointSecret not found');
        return NextResponse.json(
            { message: errorMessage }, 
            { status: 400 }) 
    }

    const body = await request.text();
    const event = stripe.webhooks.constructEvent(
        body,
        signature,
        endpointSecret
    );

    return event;
}

// 商品詳細データの作成
export async function createProductDetails({
    lineItems,
    subscriptionId,
    isCheckout = true
}: CreateProductDetailsProps) {
    const productDetails = await Promise.all(
        lineItems.map(async (item) => {
            const product = await stripe.products.retrieve(item.price?.product as string);
            
            const baseProductData = {
                product_id: product.metadata.supabase_id,
                image: product.images[0] || process.env.NEXT_PUBLIC_BASE_URL + NOIMAGE_PRODUCT_IMAGE_URL,
                unit_price: item.price?.unit_amount,
                amount: isCheckout ? item.amount_total : item.price?.unit_amount,
                quantity: item.quantity,
                stripe_price_id: item.price?.id,
                subscription_id: subscriptionId,
                subscription_status: (item.price?.recurring?.interval_count && item.price?.recurring?.interval) 
                    ? SUBS_ACTIVE 
                    : null,                    
                subscription_interval: (item.price?.recurring?.interval_count && item.price?.recurring?.interval) 
                    ? `${item.price?.recurring?.interval_count}${item.price?.recurring?.interval}` 
                    : null,           
                ...(product.metadata.subscription_product === 'true' && {
                    subscription_product: true
                })         
            };

            try {
                return {
                    ...baseProductData,
                    title: product.name
                };
            } catch (error) {
                console.error('Webhook Error - Error in Subscription Retrieving Product:', error);
                
                return {
                    ...baseProductData,
                    title: 'No Product Title'
                };
            }
        })
    );

    return productDetails;
}

// サブスクリプションの支払いデータの作成と未払い通知メールの送信
export async function handleSubscriptionEvent({
    subscriptionEvent
}: { subscriptionEvent: StripeSubscription }) {
    const subscriptionStatus = formatStripeSubscriptionStatus(subscriptionEvent?.status);

    // 1. サブスクリプションの支払いデータの作成
    const { 
        success: subscriptionPaymentSuccess, 
        error: subscriptionPaymentError 
    } = await createSubscriptionPayment({
        subscriptionPaymentData: {
            user_id: subscriptionEvent?.metadata?.userID as UserId,
            payment_date: new Date(),
            status: subscriptionStatus,
            subscription_id: subscriptionEvent.id,
        } as SubscriptionPayment
    });

    if (!subscriptionPaymentSuccess) {
        throw new Error(subscriptionPaymentError as string);
    }

    // 2. 未払い通知メールの送信
    if (subscriptionEvent?.status !== 'active') {
        const subscription = await stripe.subscriptions.retrieve(subscriptionEvent.id);
        const lineItems = subscription.items.data || [];

        const productDetails = await createProductDetails({
            lineItems,
            subscriptionId: subscriptionEvent.id,
            isCheckout: false
        });

        const { 
            success: subscriptionPaymentEmailSuccess, 
            error: subscriptionPaymentEmailError 
        } = await sendSubscriptionPaymentRequestEmail({
            orderData: subscriptionEvent,
            productDetails: productDetails as OrderProductProps[],
        });

        if (!subscriptionPaymentEmailSuccess) {
            throw new Error(subscriptionPaymentEmailError as string);
        }
    }
}