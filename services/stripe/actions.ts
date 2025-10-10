"use server"

import { stripe } from "@/lib/clients/stripe/client"

import { updateOrderItemSubscriptionStatus } from "@/services/order-item-subscription/actions"
import { SUBSCRIPTION_STATUS } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBS_CANCELLED } = SUBSCRIPTION_STATUS;
const { 
    SHIPPING_ADDRESS_ERROR, 
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
            subscriptionStatus: SUBS_CANCELLED
        })

        if (!success) {
            await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: false,
            })

            return {
                success: false,
                error: error,
                data: null
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
            data: null
        }
    }
}