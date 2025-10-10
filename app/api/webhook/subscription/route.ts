import { stripe } from "@/lib/clients/stripe/client"
import { NextRequest, NextResponse } from "next/server"

import { verifyWebhookSignature } from "@/lib/utils/webhook"
import { handleSubscriptionEvent } from "@/services/stripe/webhook-actions"
import { updateSubscriptionPaymentStatus } from "@/services/subscription-payment/actions"
import { formatStripeSubscriptionStatus } from "@/services/subscription-payment/format"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBSCRIPTION_ERROR } = ERROR_MESSAGES;

export async function POST(request: NextRequest) {   
    const endpointSecret = process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET_KEY;

    try {
        const event = await verifyWebhookSignature({
            request,
            endpointSecret: endpointSecret as string,
            errorMessage: SUBSCRIPTION_ERROR.WEBHOOK_PROCESS_FAILED
        });
        
        /* ============================== 
            サブスクリプションの継続支払い時の処理（2回目以降のサブスク契約で発生）
        ============================== */
        if (event.type === 'invoice.payment_succeeded' || event.type === 'invoice.payment_failed') {
            const invoiceEvent = event.data.object as StripeInvoice;

            // 1. サブスクリプションのデータ作成
            if (invoiceEvent.billing_reason === 'subscription_cycle') {
                const subscriptionId = invoiceEvent.parent?.subscription_details?.subscription;
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                await handleSubscriptionEvent({
                    subscriptionEvent: subscription
                });
            }
        }

        if (event.type === 'customer.subscription.updated') {
            const subscriptionEvent = event.data.object as StripeSubscription;
            const previousAttributes = event.data.previous_attributes;
            
            const currentStatus = subscriptionEvent.status;
            
            // 2. サブスクリプションのステータスの確認&更新
            if (!previousAttributes && currentStatus === 'active') {
                return NextResponse.json({ success: true });
            }
            
            const previousStatus = previousAttributes?.status;

            if (previousStatus && currentStatus && previousStatus !== currentStatus) {
                const subscriptionId = subscriptionEvent.id;
                const subscriptionStatus = formatStripeSubscriptionStatus(currentStatus);

                const { 
                    success: updatePaymentStatusSuccess, 
                    error: updatePaymentStatusError 
                } = await updateSubscriptionPaymentStatus({
                    subscriptionId,
                    status: subscriptionStatus
                });

                if (!updatePaymentStatusSuccess) {
                    throw new Error(updatePaymentStatusError as string);
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook Error - Stripe Subscription POST error:', error);

        const errorMessage = 
            error instanceof Error ? 
            error.message : SUBSCRIPTION_ERROR.WEBHOOK_PROCESS_FAILED;

        return NextResponse.json(
            { message: errorMessage }, 
            { status: 500 }
        );
    } 
}