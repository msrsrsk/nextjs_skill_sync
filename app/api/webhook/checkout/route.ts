import { stripe } from "@/lib/clients/stripe/client"
import { NextRequest, NextResponse } from "next/server"

import { verifyWebhookSignature } from "@/lib/utils/webhook"
import { handleSubscriptionEvent } from "@/services/stripe/webhook-actions"
import { processCheckoutSessionCompleted } from "@/services/stripe/checkout-actions"
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

            const result = await processCheckoutSessionCompleted({
                checkoutSessionEvent
            });

            if (!result.success) {
                return NextResponse.json(
                    { message: result.error }, 
                    { status: result.status }
                )
            }

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

        const errorMessage = error instanceof Error 
            ? error.message 
            : CHECKOUT_ERROR.WEBHOOK_PROCESS_FAILED;

        return NextResponse.json(
            { message: errorMessage }, 
            { status: 500 }
        )
    } 
}