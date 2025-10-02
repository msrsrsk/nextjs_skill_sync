"use server"

import { stripe } from "@/lib/clients/stripe/client"

import { actionAuth } from "@/lib/middleware/auth"
import { getUserRepository } from "@/repository/user"
import { getShippingAddressRepository } from "@/repository/shippingAddress"
import { setDefaultShippingAddress } from "@/services/shipping-address/actions"
import { updateOrderItemSubscriptionStatus } from "@/services/order/actions"
import { getRecurringConfig } from "@/lib/utils/format"
import { 
    SITE_MAP, 
    STRIPE_SHIPPING_FREE_LIMIT, 
    GET_USER_DATA_TYPES, 
    SUBSCRIPTION_STATUS,
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBS_CANCELLED } = SUBSCRIPTION_STATUS;
const { CUSTOMER_ID_DATA } = GET_USER_DATA_TYPES;
const { CART_PATH, ORDER_COMPLETE_PATH } = SITE_MAP;
const { 
    CHECKOUT_ERROR, 
    SHIPPING_ADDRESS_ERROR, 
    STRIPE_ERROR, 
    USER_ERROR 
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
        interval: StripeSubscriptionInterval;
        interval_count?: number;
    };
}

interface CheckoutSessionProps {
    lineItems: CheckoutLineItem[];
    userId: UserId;
}

interface CreateCheckoutSessionProps extends CheckoutSessionProps {
    totalQuantity: number;
}

interface CreatePaymentLinkProps extends CheckoutSessionProps {
    userEmail: UserEmail;
    interval: string | null;
}

/* ============================== 
    基本処理 関連
============================== */
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

export const createCustomer = async ({
    email,
    lastname, 
    firstname,
}: Omit<UserData, 'password'>) => {
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


/* ============================== 
    チェックアウト 関連
============================== */
export const createCheckoutSession = async ({ 
    lineItems, 
    userId,
    totalQuantity,
}: CreateCheckoutSessionProps) => {
    try {
        // ユーザーのStripe顧客IDを取得
        const repository = getUserRepository();
        const stripeCustomerId = await repository.getUser({
            userId,
            getType: CUSTOMER_ID_DATA
        });

        if (!stripeCustomerId) {
            return {
                success: false, 
                error: USER_ERROR.CUSTOMER_ID_FETCH_FAILED,
                data: null
            }
        }

        const customerId = stripeCustomerId.stripe_customer_id;

        // 配送料を設定
        const shippingRateId = totalQuantity >= STRIPE_SHIPPING_FREE_LIMIT
            ? process.env.STRIPE_SHIPPING_FREE_RATE_ID 
            : process.env.STRIPE_SHIPPING_REGULAR_RATE_ID;

        // チェックアウトセッションを作成
        const sessionConfig: StripeCheckoutSessionCreateParams = {
            payment_method_types: ['card'],
            currency: 'jpy',
            shipping_address_collection: {
                allowed_countries: ['JP'],
            },
            phone_number_collection: { 
                enabled: true 
            },
            customer: customerId,
            line_items: lineItems,
            shipping_options: [
                {
                    shipping_rate: shippingRateId,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}${ORDER_COMPLETE_PATH}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}${CART_PATH}`,
            metadata: {
                userID: userId,
            }
        }
        
        const session = await stripe.checkout.sessions.create(sessionConfig);

        return {
            success: true, 
            error: null, 
            data: session
        }
    } catch (error) {
        console.error('Actions Error - Create Checkout Session error:', error);

        return {
            success: false, 
            error: CHECKOUT_ERROR.CHECKOUT_SESSION_FAILED,
            data: null
        }
    }
};

export const createPaymentLink = async ({ 
    lineItems, 
    userId,
    userEmail,
    interval
}: CreatePaymentLinkProps) => {
    try {
        const shippingRateAmount = await getShippingRateAmount(process.env.STRIPE_SHIPPING_REGULAR_RATE_ID as string);

        if (!interval || !shippingRateAmount) {
            return {
                success: false, 
                error: CHECKOUT_ERROR.NO_SUBSCRIPTION_INTERVAL,
                data: null
            }
        }

        const lineItemsWithShipping = [
            ...lineItems,
            {
                price_data: {
                    currency: 'jpy',
                    product_data: {
                        name: '配送料',
                    },
                    recurring: getRecurringConfig(interval),
                    unit_amount: shippingRateAmount.data,
                },
                quantity: 1,
            }
        ];

        // Payment Linkを作成
        const paymentLinkConfig: StripePaymentLinkCreateParams = {
            payment_method_types: ['card'],
            currency: 'jpy',
            shipping_address_collection: {
                allowed_countries: ['JP'],
            },
            phone_number_collection: { 
                enabled: true 
            },
            line_items: lineItemsWithShipping,
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}${ORDER_COMPLETE_PATH}`
                }
            },
            metadata: {
                userID: userId,
            },
            subscription_data: {
                metadata: {
                    userID: userId,
                    userEmail: userEmail,
                    subscription_shipping_fee: shippingRateAmount.data.toString(),
                }
            }
        }
        
        const paymentLink = await stripe.paymentLinks.create(paymentLinkConfig);

        return {
            success: true, 
            error: null, 
            data: paymentLink
        }
    } catch (error) {
        console.error('Actions Error - Create Payment Link error:', error);

        return {
            success: false, 
            error: CHECKOUT_ERROR.PAYMENT_LINK_FAILED,
            data: null
        }
    }
};


/* ============================== 
    配送 関連
============================== */
export const getShippingRateAmount = async (shippingRateId: string) => {
    try {
        const shippingRate = await stripe.shippingRates.retrieve(shippingRateId);
        
        if (shippingRate.fixed_amount) {
            return {
                success: true,
                error: null,
                data: shippingRate.fixed_amount.amount
            };
        }
        
        return null;
    } catch (error) {
        console.error('Actions Error - Get Shipping Rate Amount error:', error);

        return null;
    }
}

export const updateCustomerShippingAddress = async (
    customerId: string,
    data: CustomerDetails
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

export async function setDefaultShippingAddressAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionStateWithTimestamp> {
    try {
        // throw new Error('お届け先として設定ができませんでした。\n時間をおいて再度お試しください。');

        const { userId } = await actionAuth(
            SHIPPING_ADDRESS_ERROR.UPDATE_DEFAULT_UNAUTHORIZED,
        );
    
        const newDefaultAddressId = formData.get('newDefaultAddressId') as ShippingAddressId;
    
        if (!newDefaultAddressId) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.MISSING_ID,
                timestamp: Date.now()
            }
        }

        const shippingAddressRepository = getShippingAddressRepository();
        const newDefaultAddressResult = await shippingAddressRepository.getShippingAddressById({
            addressId: newDefaultAddressId
        });

        if (!newDefaultAddressResult) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.INDIVIDUAL_FETCH_FAILED,
                timestamp: Date.now()
            }
        }

        const userRepository = getUserRepository();
        const stripeCustomerIdResult = await userRepository.getUser({
            userId: userId as UserId,
            getType: CUSTOMER_ID_DATA
        });

        if (!stripeCustomerIdResult) {
            return {
                success: false, 
                error: USER_ERROR.CUSTOMER_ID_FETCH_FAILED,
                timestamp: Date.now()
            }
        }

        const customerId = stripeCustomerIdResult.stripe_customer_id;

        const [stripeResult, setDefaultAddressResult] = await Promise.all([
            customerId ? updateCustomerShippingAddress(
                customerId,
                {
                    address: {
                        line1: newDefaultAddressResult.address_line1,
                        line2: newDefaultAddressResult.address_line2 || '',
                        city: newDefaultAddressResult.city || '',
                        state: newDefaultAddressResult.state,
                        postal_code: newDefaultAddressResult.postal_code
                    },
                    name: newDefaultAddressResult.name,
                }
            ) : Promise.resolve({ 
                success: true, 
                error: null, 
                data: null 
            }),
            setDefaultShippingAddress({ addressId: newDefaultAddressId })
        ]);

        if (!stripeResult.success) {
            return {
                success: false, 
                error: stripeResult.error,
                timestamp: Date.now()
            }
        }

        if (!setDefaultAddressResult.success) {
            return {
                success: false, 
                error: setDefaultAddressResult.error,
                timestamp: Date.now()
            }
        }

        return {
            success: true, 
            error: null, 
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Set Default Shipping Address error:', error);

        return {
            success: false, 
            error: SHIPPING_ADDRESS_ERROR.SET_DEFAULT_FAILED,
            timestamp: Date.now()
        }
    }
}


/* ============================== 
    サブスクリプション 関連
============================== */
export const cancelSubscription = async ({ 
    subscriptionId, 
}: { subscriptionId: OrderItemSubscriptionId }) => {
    try {
        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
            metadata: {
                canceled_at: new Date().toISOString(),
                cancel_reason: 'user_requested'
            }
        });

        const { success, error } = await updateOrderItemSubscriptionStatus({
            subscriptionId,
            subscriptionStatus: SUBS_CANCELLED
        });

        if (!success) {
            await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: false,
            });

            return {
                success: false,
                error: error,
                data: null
            };
        }

        return {
            success: true,
            error: null,
            data: updatedSubscription
        };
    } catch (error) {
        console.error('Actions Error - Cancel Subscription error:', error);
        
        return {
            success: false,
            error: STRIPE_ERROR.CANCEL_SUBSCRIPTION_FAILED,
            data: null
        };
    }
};