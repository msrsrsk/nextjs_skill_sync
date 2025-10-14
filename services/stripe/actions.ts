"use server"

import { stripe } from "@/lib/clients/stripe/client"

import { updateOrderItemSubscriptionStatus } from "@/services/order-item-subscription/actions"
import {
    getRecurringConfig, 
    formatCreateSubscriptionNickname 
} from "@/services/subscription-payment/format"
import { 
    extractCreateSubscriptionPrices, 
    extractUpdatedSubscriptionPriceIds 
} from "@/services/subscription-payment/extractors"
import { SUBSCRIPTION_STATUS } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBS_CANCELED } = SUBSCRIPTION_STATUS;
const { 
    SHIPPING_ADDRESS_ERROR, 
    SUBSCRIPTION_ERROR,
    STRIPE_ERROR, 
} = ERROR_MESSAGES;

interface StripeProductCreateParams {
    name: string;
    metadata: {
        supabase_id: string;
    };
}

interface StripePriceCreateParams {
    product: string;
    unit_amount: number;
    currency: string;
    nickname?: string;
    recurring?: {
        interval: StripeSubscriptionIntervalType;
        interval_count?: number;
    };
}

interface CreateCustomerProps extends UserProfileData {
    email: UserEmail;
}

interface CreateSubscriptionPricesProps {
    productData: StripeProduct;
    subscriptionPriceIds: StripeSubscriptionPriceIds;
}

export const createStripeProduct = async (data: StripeProductCreateParams) => {
    try {
        const product = await stripe.products.create(data);
    
        return {
            success: true, 
            error: null, 
            data: product
        }
    } catch (error) {
        console.error('Actions Error - Create Stripe Product error:', error);

        return {
            success: false, 
            error: STRIPE_ERROR.PRODUCT_CREATE_FAILED,
            data: null
        }
    }
}

export const createStripePrice = async (data: StripePriceCreateParams) => {
    try {
        const price = await stripe.prices.create(data);

        return {
            success: true, 
            error: null, 
            data: price
        }
    } catch (error) {
        console.error('Actions Error - Create Stripe Price error:', error);

        return {
            success: false, 
            error: STRIPE_ERROR.PRICE_CREATE_FAILED,
            data: null
        }
    }
}

export const createStripeCustomer = async ({
    email,
    lastname, 
    firstname,
}: CreateCustomerProps) => {
    try {
        const customer = await stripe.customers.create({
            name: `${lastname}${firstname}`,
            email,
        });

        return {
            success: true, 
            error: null, 
            data: customer
        }
    } catch (error) {
        console.error('Actions Error - Create Customer error:', error);

        return {
            success: false, 
            error: STRIPE_ERROR.CUSTOMER_CREATE_FAILED,
            data: null
        }
    }
}

export const createSubscriptionPrices = async ({
    productData,
    subscriptionPriceIds,
}: CreateSubscriptionPricesProps) => {
    if (!subscriptionPriceIds) return subscriptionPriceIds;

    try {
        const subscriptionPrices = extractCreateSubscriptionPrices(subscriptionPriceIds);
        
        const subscriptionPriceResults = await Promise.all(
            subscriptionPrices.map(async (priceData) => {
                const { interval, price } = priceData as CreateSubscriptionOption;
                
                const getNickname = formatCreateSubscriptionNickname(interval);
                
                const recurringConfig = getRecurringConfig(interval);
                
                if (!recurringConfig) {
                    console.error(SUBSCRIPTION_ERROR.SUBSCRIPTION_PRICE_RECURRING_CONFIG_FETCH_FAILED);
                    return null;
                }
                
                const { success, data } = await createStripePrice({
                    product: productData.id,
                    unit_amount: price!,
                    currency: 'jpy',
                    nickname: getNickname,
                    recurring: recurringConfig
                });
                
                if (!success || !data) {
                    console.error(SUBSCRIPTION_ERROR.SUBSCRIPTION_PRICE_CREATE_FAILED);
                    return null;
                }
    
                return {
                    interval,
                    priceId: data.id,
                    price
                }
            })
        )
    
        const successfulPrices = subscriptionPriceResults
            .filter(result => result !== null);
    
        return extractUpdatedSubscriptionPriceIds(
            subscriptionPriceIds, 
            successfulPrices
        )
    } catch (error) {
        console.error('Error in createSubscriptionPrices:', error);
        throw error;
    }
}


export const getShippingRateAmount = async (shippingRateId: string) => {
    try {
        const shippingRate = await stripe.shippingRates.retrieve(shippingRateId);
        
        if (shippingRate.fixed_amount) {
            return {
                success: true,
                error: null,
                data: shippingRate.fixed_amount.amount
            }
        }
        
        return null;
    } catch (error) {
        console.error('Actions Error - Get Shipping Rate Amount error:', error);
        return null;
    }
}

export const updateCustomerShippingAddress = async (
    customerId: string,
    data: StripeCustomerDetails
) => {
    try {
        const customer = await stripe.customers.update(customerId, {
            shipping: {
                address: {
                    line1: data.address?.line1,
                    line2: data.address?.line2 || '',
                    city: data.address?.city || '',
                    state: data.address?.state,
                    postal_code: data.address?.postal_code,
                    country: 'JP'
                },
                name: data.name,
                phone: data.phone
            }
        });

        return {
            success: true, 
            error: null, 
            data: customer
        }
    } catch (error) {
        console.error('Actions Error - Update Customer Shipping Address error:', error);

        return {
            success: false, 
            error: SHIPPING_ADDRESS_ERROR.SET_DEFAULT_FAILED,
            data: null
        }
    }
}

export const deleteStripeCustomer = async ({
    customerId
}: { customerId: StripeCustomerId }) => {
    try {
        await stripe.customers.del(customerId);

        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Actions Error - Delete Customer error:', error);

        return {
            success: false, 
            error: STRIPE_ERROR.CUSTOMER_DELETE_FAILED
        }
    }
}

export const cancelSubscription = async ({ 
    subscriptionId, 
}: { subscriptionId: OrderItemSubscriptionSubscriptionId }) => {
    try {
        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
            metadata: {
                canceled_at: new Date().toISOString(),
                cancel_reason: 'user_requested'
            }
        })

        const { success, error } = await updateOrderItemSubscriptionStatus({
            subscriptionId,
            subscriptionStatus: SUBS_CANCELED
        })

        if (!success) {
            await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: false,
            })

            return {
                success: false,
                error: error,
                status: 500
            }
        }

        return {
            success: true,
            error: null,
            data: updatedSubscription
        }
    } catch (error) {
        console.error('Actions Error - Cancel Subscription error:', error);
        
        return {
            success: false,
            error: STRIPE_ERROR.CANCEL_SUBSCRIPTION_FAILED,
            status: 500
        }
    }
}

export const deactivatePaymentLink = async ({
    checkoutSessionEvent
}: { checkoutSessionEvent: StripeCheckoutSession }) => {
    try {
        await stripe.paymentLinks.update(checkoutSessionEvent.payment_link, {
            active: false
        });

        return {
            success: true,
            error: null
        }
    } catch (error) {
        return {
            success: false,
            error: STRIPE_ERROR.PAYMENT_LINK_DEACTIVATE_FAILED
        }
    }
}