import { stripe } from "@/lib/clients/stripe/client"
import { NextRequest, NextResponse } from "next/server"

import { verifyWebhookSignature } from "@/lib/utils/webhook"
import { updateProductStockAndSoldCount } from "@/services/order/actions"
import { handleSubscriptionEvent } from "@/services/stripe/webhook-actions"
import { sendOrderCompleteEmail } from "@/services/email/order/confirmation"
import { sendOrderEmails } from "@/services/stripe/webhook-actions"
import { deactivatePaymentLink } from "@/services/stripe/actions"
import { processOrderData, processShippingAddress } from "@/services/stripe/webhook-actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHECKOUT_ERROR } = ERROR_MESSAGES;

export async function POST(request: NextRequest) {   
    const endpointSecret = process.env.STRIPE_CHECKOUT_WEBHOOK_SECRET_KEY;

    try {
        const event = await verifyWebhookSignature({
            request,
            endpointSecret: endpointSecret as string,
            errorMessage: CHECKOUT_ERROR.WEBHOOK_PROCESS_FAILED
        });

        /* ============================== 
            購入完了時の処理（通常商品とサブスク商品の両方の注文で発生）
        ============================== */
        if (event.type === 'checkout.session.completed') {
            const checkoutSessionEvent = event.data.object as StripeCheckoutSession;

            const { 
                orderData, 
                productDetails 
            } = await handleCheckoutSessionCompleted({
                checkoutSessionEvent
            });

            // サブスクリプションの注文の場合
            if (checkoutSessionEvent.subscription) {
                const subscription = await stripe.subscriptions.retrieve(
                    checkoutSessionEvent.subscription
                );

                await handleSubscriptionEvent({
                    subscriptionEvent: subscription,
                    orderData,
                    productDetails
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook Error - Stripe Checkout POST error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : CHECKOUT_ERROR.WEBHOOK_PROCESS_FAILED;

        return NextResponse.json(
            { message: errorMessage }, 
            { status: 500 }
        );
    } 
}

async function handleCheckoutSessionCompleted({
    checkoutSessionEvent,
}: { checkoutSessionEvent: StripeCheckoutSession }) {

    // 1. 注文データの処理
    const { orderData, productDetails } = await processOrderData({
        checkoutSessionEvent
    });

    // 2. 在庫数と売り上げ数の更新
    const { 
        success: updateStockSuccess, 
        error: updateStockError 
    } = await updateProductStockAndSoldCount({ orderId: orderData.order.id });

    if (!updateStockSuccess) {
        throw new Error(updateStockError as string);
    }

    // 3. 配送先住所のデータ保存
    const userId = checkoutSessionEvent?.metadata?.userID as UserId;

    await processShippingAddress({
        checkoutSessionEvent,
        userId
    });

    // 4. 注文完了メールの送信
    const { 
        success: orderEmailSuccess, 
        error: orderEmailError 
    } = await sendOrderCompleteEmail({
        orderData: checkoutSessionEvent,
        productDetails: productDetails as StripeProductDetailsProps[],
        orderNumber: orderData.order.order_number
    });

    if (!orderEmailSuccess) {
        throw new Error(orderEmailError as string);
    }

    const isNotEventSubscription = checkoutSessionEvent.mode !== 'subscription';

    // 5. 未払いの場合のメール送信
    if (checkoutSessionEvent.payment_status !== 'paid' && isNotEventSubscription) {
        await sendOrderEmails({
            checkoutSessionEvent,
            productDetails: productDetails as StripeProductDetailsProps[],
            orderData
        });
    }

    // 6. Payment Link の無効化
    if (checkoutSessionEvent.payment_link && isNotEventSubscription) {
        await deactivatePaymentLink({
            checkoutSessionEvent
        });
    }

    return { orderData, productDetails };
}