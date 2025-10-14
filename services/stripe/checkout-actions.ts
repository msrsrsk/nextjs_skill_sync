import { stripe } from "@/lib/clients/stripe/client"

import { getUser } from "@/services/user/actions"
import { getShippingRateAmount } from "@/services/stripe/actions"
import { getRecurringConfig } from "@/services/subscription-payment/format"
import { 
    SITE_MAP, 
    STRIPE_SHIPPING_FREE_LIMIT, 
    GET_USER_DATA_TYPES, 
    CHECKOUT_INITIAL_QUANTITY,
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CUSTOMER_ID_DATA } = GET_USER_DATA_TYPES;
const { CART_PATH, ORDER_COMPLETE_PATH } = SITE_MAP;
const { 
    USER_STRIPE_ERROR,
    CHECKOUT_ERROR 
} = ERROR_MESSAGES;

interface GetSubscriptionShippingFeeProps {
    session: StripeCheckoutSession;
    subscriptionShippingFee: number;
}

interface GetPaymentMethodProps {
    session: StripeCheckoutSession;
    cardBrand: string;
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

interface ProcessCheckoutItemsProps extends UserIdProps {
    cartItems: CartItemWithProduct[];
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
            error: CHECKOUT_ERROR.SUBSCRIPTION_SHIPPING_FEE_FAILED,
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
            error: CHECKOUT_ERROR.PAYMENT_METHOD_FAILED,
            data: 'card'
        }
    }
}

// チェックアウトセッションの作成
export const createCheckoutSession = async ({ 
    lineItems, 
    userId,
    totalQuantity,
}: CreateCheckoutSessionProps) => {

    // 1. 配送料の設定
    const shippingRateId = totalQuantity >= STRIPE_SHIPPING_FREE_LIMIT
        ? process.env.STRIPE_SHIPPING_FREE_RATE_ID 
        : process.env.STRIPE_SHIPPING_REGULAR_RATE_ID;
        
    try {
        // 2. ユーザーのStripe顧客IDの取得
        const user = await getUser({
            userId: userId as UserId,
            getType: CUSTOMER_ID_DATA,
            errorMessage: USER_STRIPE_ERROR.CUSTOMER_ID_FETCH_FAILED
        });
        
        const customerId = user.user_stripes?.customer_id;
        
        // 3. チェックアウトセッションの作成
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
            status: 500
        }
    }
}

// 支払いリンクの作成
export const createPaymentLink = async ({ 
    lineItems, 
    userId,
    userEmail,
    interval
}: CreatePaymentLinkProps) => {
    try {
        // 1. 配送料の取得
        const shippingRateAmount = await getShippingRateAmount(
            process.env.STRIPE_SHIPPING_REGULAR_RATE_ID as string
        );

        if (!interval || !shippingRateAmount) {
            return {
                success: false, 
                error: CHECKOUT_ERROR.NO_SUBSCRIPTION_INTERVAL,
                status: 400
            }
        }

        // 2. 配送の設定
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
            status: 500
        }
    }
}

export const processCheckoutItems = async ({
    userId,
    cartItems
}: ProcessCheckoutItemsProps) => {
    try {
        // 商品の合計数量を計算
        const totalQuantity = cartItems.reduce((
            sum: number, 
            item: CartItemWithProduct
        ) => sum + item.quantity, CHECKOUT_INITIAL_QUANTITY);

        // チェックアウトの商品リストを作成
        let lineItems: CheckoutLineItem[] = [];

        for (const cartItem of cartItems) {
            const product = cartItem.product;

            if (!product) {
                return {
                    success: false, 
                    error: CHECKOUT_ERROR.NO_PRODUCT_DATA,
                    status: 404
                }
            }

            const priceId = product.product_stripes?.sale_price_id 
                || product.product_stripes?.regular_price_id;

            if (!priceId) {
                return {
                    success: false, 
                    error: CHECKOUT_ERROR.NO_PRICE_ID,
                    status: 404
                }
            }

            lineItems = [...lineItems, {
                price: priceId,
                quantity: cartItem.quantity,
            }];
        }

        const checkoutResult = await createCheckoutSession({ 
            lineItems, 
            userId,
            totalQuantity,
        })

        return {
            success: true,
            error: null,
            data: checkoutResult
        }
    } catch (error) {
        console.error('API Error - Process Checkout Items error:', error);

        return {
            success: false, 
            error: CHECKOUT_ERROR.CHECKOUT_PRODUCT_CREATE_FAILED,
            status: 500
        }
    }
}