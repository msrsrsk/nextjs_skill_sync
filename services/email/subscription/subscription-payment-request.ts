"use server"

import { Resend } from "resend"

import { subscriptionPaymentRequestEmailTemplate } from "@/lib/templates/email/subscription"
import { formatOrderDateTime } from "@/services/order/format"
import { formatNumber } from "@/lib/utils/format"
import { ERROR_MESSAGES } from "@/constants/errorMessages"
import { SITE_MAP } from "@/constants/index"

const { SUBSCRIPTION_HISTORY_PATH } = SITE_MAP;
const { EMAIL_ERROR } = ERROR_MESSAGES;

interface SendPaymentRequestEmailProps {
    orderData: StripeSubscription;
    productDetails: StripeProductDetailsProps[];
}

// 未払いの場合のメール送信
export async function sendSubscriptionPaymentRequestEmail({ 
    orderData,
    productDetails,
}: SendPaymentRequestEmailProps) {
    if (!orderData || !productDetails) {
        return {
            success: false, 
            error: EMAIL_ERROR.SUBSCRIPTION_PAYMENT_REQUEST_SEND_FAILED
        }
    }

    const resend = new Resend(process.env.RESEND_CHECKOUT_API_KEY);

    const subscriptionHistoryUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${SUBSCRIPTION_HISTORY_PATH}`;

    const email = orderData.metadata?.userEmail as UserEmail;
    const shippingFee = formatNumber((Number(orderData.metadata?.subscription_shipping_fee) ?? 0));
    const formattedOrderDate = formatOrderDateTime(orderData.created, true);
    const subtotal = formatNumber((orderData.plan.amount ?? 0));
    const total = formatNumber((orderData.plan.amount ?? 0));
    const subscriptionId = orderData.id;
    const createdAt = orderData.created;

    try {
        await resend.emails.send({
            from: 'notification@skill-sync.site',
            to: [email],
            subject: `【Skill Sync】サブスクリプションのお支払いのお願い`,
            html: subscriptionPaymentRequestEmailTemplate({
                subscriptionHistoryUrl,
                subscriptionId,
                formattedOrderDate,
                productDetails,
                shippingFee,
                subtotal,
                total,
                createdAt
            })
        });
        
        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Email Error: Send Subscription Payment Request Email error:', error);
        
        return {
            success: false, 
            error: EMAIL_ERROR.SUBSCRIPTION_PAYMENT_REQUEST_SEND_FAILED
        }
    }
}