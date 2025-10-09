import { stripe } from "@/lib/clients/stripe/client"

import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { STRIPE_ERROR } = ERROR_MESSAGES;

interface GetSubscriptionShippingFeeProps {
    session: StripeCheckoutSession;
    subscriptionShippingFee: number;
}

interface GetPaymentMethodProps {
    session: StripeCheckoutSession;
    cardBrand: string;
}

// サブスクリプションの配送料の取得
export const getSubscriptionShippingFee = async ({
    session,
    subscriptionShippingFee
}: GetSubscriptionShippingFeeProps) => {
    try {
        const subscription = await stripe.subscriptions.retrieve(session?.subscription);

        if (subscription.latest_invoice) {
            const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
            const invoiceData = invoice as StripeInvoice;
            
            const subscriptionMetadata = invoiceData.parent?.subscription_details?.metadata;
            subscriptionShippingFee = Number(subscriptionMetadata?.subscription_shipping_fee);

            return {
                success: true,
                error: null,
                data: subscriptionShippingFee
            }
        }

        return {
            success: true,
            error: null,
            data: 0
        }
    } catch (error) {
        console.error('Database : Error in getSubscriptionShippingFee: ', error);

        return {
            success: false,
            error: STRIPE_ERROR.SUBSCRIPTION_SHIPPING_FEE_FAILED,
            data: 0
        }
    }
}

// 支払い方法の取得
export const getPaymentMethod = async ({
    session,
    cardBrand
}: GetPaymentMethodProps) => {
    try {
        const sessionWithPaymentMethod = await stripe.paymentIntents.retrieve(
            session.payment_intent,
            { expand: ['payment_method'] }
        );

        if (sessionWithPaymentMethod.payment_method) {
            cardBrand = (
                sessionWithPaymentMethod.payment_method as StripePaymentMethod
            ).card?.brand || 'card';

            return {
                success: true,
                error: null,
                data: cardBrand
            }
        }

        return {
            success: true,
            error: null,
            data: 'card'
        }
    } catch (error) {
        console.error('Database : Error in getPaymentMethod: ', error);

        return {
            success: false,
            error: STRIPE_ERROR.PAYMENT_METHOD_FAILED,
            data: 'card'
        }
    }
}