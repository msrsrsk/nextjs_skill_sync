import { stripe } from "@/lib/clients/stripe/client"
import { NextRequest, NextResponse } from "next/server"

import { verifyWebhookSignature } from "@/lib/services/stripe/webhook/actions"
import { createCheckoutOrder } from "@/lib/services/order/actions"
import { deleteOrder } from "@/lib/services/order/actions"
import { createCheckoutOrderItems } from "@/lib/services/order/actions"
import { createShippingAddress } from "@/lib/services/shipping-address/actions"
import { getShippingAddressRepository } from "@/repository/shippingAddress"
import { updateProductStockAndSoldCount } from "@/lib/services/order/actions"
import { updateCustomerShippingAddress, } from "@/lib/services/stripe/actions"
import { createProductDetails, handleSubscriptionEvent } from "@/lib/services/stripe/webhook/actions"
import { sendOrderCompleteEmail } from "@/lib/services/email/order/confirmation"
import { sendPaymentRequestEmail } from "@/lib/services/email/order/payment-request"
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

            await handleCheckoutSessionCompleted({
                checkoutSessionEvent
            });

            // サブスクリプションの注文の場合
            if (checkoutSessionEvent.subscription) {
                const subscription = await stripe.subscriptions.retrieve(
                    checkoutSessionEvent.subscription
                );

                await handleSubscriptionEvent({
                    subscriptionEvent: subscription
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook Error - Stripe Checkout POST error:', error);

        const errorMessage = 
            error instanceof Error ? 
            error.message : CHECKOUT_ERROR.WEBHOOK_PROCESS_FAILED;

        return NextResponse.json(
            { message: errorMessage }, 
            { status: 500 }
        );
    } 
}

async function handleCheckoutSessionCompleted({
    checkoutSessionEvent,
}: { checkoutSessionEvent: StripeCheckoutSession }) {

    // 1.注文データの取得と保存
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        checkoutSessionEvent.id, 
        { expand: ['line_items'] }
    );
    const lineItems = sessionWithLineItems.line_items?.data || [];

    const productDetails = await createProductDetails({
        lineItems,
        subscriptionId: checkoutSessionEvent.subscription,
        isCheckout: true
    });

    // Order テーブルのデータ作成
    const { 
        success: orderSuccess, 
        data: orderData,
        error: orderError, 
    } = await createCheckoutOrder({ session: checkoutSessionEvent });

    if (!orderSuccess || !orderData) {
        throw new Error(orderError as string);
    }

    // OrderItems テーブルのデータ作成
    const  { 
        success: orderItemsSuccess, 
        error: orderItemsError 
    } = await createCheckoutOrderItems({
        orderId: orderData.id, 
        productDetails: productDetails as OrderProductProps[]
    });

    if (!orderItemsSuccess) {
        await deleteOrder({ orderId: orderData.id });
        throw new Error(orderItemsError as string);
    }

    // 2. Supabase の在庫数と売り上げ数の更新
    const { 
        success: updateStockSuccess, 
        error: updateStockError 
    } = await updateProductStockAndSoldCount({ orderId: orderData.id });

    if (!updateStockSuccess) {
        throw new Error(updateStockError as string);
    }

    // 3. 配送先住所のデータ保存
    const userId = checkoutSessionEvent?.metadata?.userID as UserId;
    const repository = getShippingAddressRepository();
    const defaultShippingAddress = await repository.getUserDefaultShippingAddress({
        userId
    });
    
    // デフォルトの配送先住所の有無確認（ない場合）
    if (!defaultShippingAddress) {
        const customerId = checkoutSessionEvent?.customer as string;

        // デフォルトの配送先住所のデータ保存
        const customerDetails = checkoutSessionEvent.customer_details;

        if (customerDetails && customerId) {
            const address = customerDetails.address;

            const { 
                success: createAddressSuccess, 
                error: createAddressError 
            } = await createShippingAddress({
                address: {
                    user_id: userId,
                    name: customerDetails.name,
                    postal_code: address?.postal_code,
                    state: address?.state,
                    city: address?.city || '',
                    address_line1: address?.line1,
                    address_line2: address?.line2 || '',
                    is_default: true
                } as ShippingAddress
            })

            if (!createAddressSuccess) {
                throw new Error(createAddressError as string);
            }

            const { 
                success: updateCustomerAddressSuccess, 
                error: updateCustomerAddressError 
            } = await updateCustomerShippingAddress(customerId, {
                address: {
                    line1: address?.line1,
                    line2: address?.line2 || '',
                    city: address?.city || '',
                    state: address?.state,
                    postal_code: address?.postal_code
                },
                name: customerDetails.name,
            });

            if (!updateCustomerAddressSuccess) {
                throw new Error(updateCustomerAddressError as string);
            }
        }
    }

    // 4. 注文完了メールの送信
    const { 
        success: orderEmailSuccess, 
        error: orderEmailError 
    } = await sendOrderCompleteEmail({
        orderData: checkoutSessionEvent,
        productDetails: productDetails as OrderProductProps[],
        orderNumber: orderData.order_number
    });

    if (!orderEmailSuccess) {
        throw new Error(orderEmailError as string);
    }

    const isNotEventSubscription = checkoutSessionEvent.mode !== 'subscription';

    // 5. 未払いの場合のメール送信
    if (checkoutSessionEvent.payment_status !== 'paid' && isNotEventSubscription) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
            checkoutSessionEvent.payment_intent
        );
        
        const { 
            success: paymentEmailSuccess, 
            error: paymentEmailError 
        } = await sendPaymentRequestEmail({
            orderData: checkoutSessionEvent,
            productDetails: productDetails as OrderProductProps[],
            orderNumber: orderData.order_number,
            paymentIntent
        });

        if (!paymentEmailSuccess) {
            throw new Error(paymentEmailError as string);
        }
    }

    // 6. Payment Link の無効化
    if (checkoutSessionEvent.payment_link && isNotEventSubscription) {
        try {
            await stripe.paymentLinks.update(checkoutSessionEvent.payment_link, {
                active: false
            });
        } catch (error) {
            throw new Error(CHECKOUT_ERROR.PAYMENT_LINK_DEACTIVATE_FAILED);
        }
    }
}