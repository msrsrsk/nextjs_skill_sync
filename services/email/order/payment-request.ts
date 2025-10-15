"use server"

import { Resend } from "resend"

import { paymentRequestEmailTemplate } from "@/lib/templates/email/order"
import { formatOrderDateTime } from "@/services/order/format"
import { formatNumber } from "@/lib/utils/format"
import { ERROR_MESSAGES } from "@/constants/errorMessages"
import { DATE_FORMAT_TYPES, SITE_MAP } from "@/constants/index"

const { DATE_SLASH } = DATE_FORMAT_TYPES;
const { ORDER_HISTORY_PATH } = SITE_MAP;
const { EMAIL_ERROR } = ERROR_MESSAGES;

interface SendPaymentRequestEmailProps extends OrderCompleteEmailProps {
    paymentIntent: StripePaymentIntent | null;
    checkoutSessionEvent: StripeCheckoutSession;
}

// 未払いの場合のメール送信
export async function sendPaymentRequestEmail({ 
    orderData,
    productDetails,
    orderNumber,
    paymentIntent,
    checkoutSessionEvent
}: SendPaymentRequestEmailProps) {
    if (!orderData || !productDetails || !orderNumber) {
        return {
            success: false, 
            error: EMAIL_ERROR.PAYMENT_REQUEST_SEND_FAILED
        }
    }

    const resend = new Resend(process.env.RESEND_CHECKOUT_API_KEY);

    const orderHistoryUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${ORDER_HISTORY_PATH}`;

    const email = orderData.customer_details?.email as UserEmail;
    const formattedOrderDate = formatOrderDateTime(orderData.created, DATE_SLASH);
    const shippingFee = formatNumber((orderData.total_details?.amount_shipping ?? 0));
    const subtotal = formatNumber((orderData.amount_subtotal ?? 0));
    const total = formatNumber((orderData.amount_total ?? 0));
    const errorType = paymentIntent?.last_payment_error?.code || 'unknown';

    try {
        await resend.emails.send({
            from: 'notification@skill-sync.site',
            to: [email],
            subject: `【Skill Sync】お支払いのお願い`,
            html: paymentRequestEmailTemplate({
                paymentIntent,
                orderHistoryUrl,
                orderNumber,
                formattedOrderDate,
                productDetails,
                subtotal,
                shippingFee,
                total,
                errorType,
                checkoutSessionEvent
            })
        });
        
        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Email Error: Send Payment Request Email error:', error);
        
        return {
            success: false, 
            error: EMAIL_ERROR.PAYMENT_REQUEST_SEND_FAILED
        }
    }
}