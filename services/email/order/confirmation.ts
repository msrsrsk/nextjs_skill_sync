"use server"

import { Resend } from "resend"

import { orderCompleteEmailTemplate } from "@/lib/templates/email/order"
import { getShippingRateAmount } from "@/services/stripe/actions"
import { formatNumber } from "@/lib/utils/format"
import { formatOrderDateTime, formatPaymentMethodType } from "@/services/order/format"
import { ERROR_MESSAGES } from "@/constants/errorMessages"
import { DATE_FORMAT_TYPES, SITE_MAP } from "@/constants/index"

const { DATE_SLASH } = DATE_FORMAT_TYPES;
const { ORDER_HISTORY_PATH } = SITE_MAP;
const { EMAIL_ERROR } = ERROR_MESSAGES;

// 注文完了メールの送信
export async function sendOrderCompleteEmail({ 
    orderData,
    productDetails,
    orderNumber
}: OrderCompleteEmailProps) {
    if (!orderData || !productDetails || !orderNumber) {
        return {
            success: false, 
            error: EMAIL_ERROR.ORDER_SEND_FAILED
        }
    }

    const resend = new Resend(process.env.RESEND_CHECKOUT_API_KEY);

    const orderHistoryUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${ORDER_HISTORY_PATH}`;
    
    const name = orderData.customer_details?.name as string;
    const email = orderData.customer_details?.email as UserEmail;

    const shippingRateAmount = await getShippingRateAmount(process.env.STRIPE_SHIPPING_REGULAR_RATE_ID as string);

    if (!email || !shippingRateAmount?.success) {
        return {
            success: false,
            error: EMAIL_ERROR.ORDER_SEND_FAILED
        }
    }

    const subscriptionShippingFee = orderData.mode === 'subscription' ? shippingRateAmount?.data : null;
    const sessionShippingFee = orderData.total_details?.amount_shipping ?? 0;

    const formattedOrderDate = formatOrderDateTime(orderData.created, DATE_SLASH);
    const shippingDetails = orderData.customer_details?.address as StripeAddress;

    const shippingFeeAmount = subscriptionShippingFee || sessionShippingFee;
    const shippingFee = formatNumber(shippingFeeAmount);
    
    const subtotal = orderData.mode === 'subscription' 
        ? formatNumber((orderData.amount_subtotal ?? 0) - shippingFeeAmount)
        : formatNumber(orderData.amount_subtotal ?? 0);
    const total = formatNumber((orderData.amount_total ?? 0));
    const paymentMethodType = orderData.payment_method_types[0];
    const cardType = formatPaymentMethodType(paymentMethodType);
    const paid = orderData.payment_status === 'paid' ? true : false;

    try {
        await resend.emails.send({
            from: 'notification@skill-sync.site',
            to: [email],
            subject: `【Skill Sync】ご注文いただきありがとうございます`,
            html: orderCompleteEmailTemplate({
                productDetails,
                orderNumber,
                name,
                orderHistoryUrl,
                formattedOrderDate,
                shippingDetails,
                shippingFee,
                subtotal,
                total,
                cardType,
                paid,
            })
        });
        
        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Email Error: Send Order Complete Email error:', error);
        
        return {
            success: false, 
            error: EMAIL_ERROR.ORDER_SEND_FAILED
        }
    }
}