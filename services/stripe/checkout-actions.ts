import { stripe } from "@/lib/clients/stripe/client"

import { getUser } from "@/services/user/actions"
import { getShippingRateAmount, deactivatePaymentLink } from "@/services/stripe/actions"
import { 
    processOrderData, 
    sendOrderEmails, 
    processShippingAddress 
} from "@/services/stripe/webhook-actions"
import { updateProductStockAndSoldCount } from "@/services/order/actions"
import { sendOrderCompleteEmail } from "@/services/email/order/confirmation"
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

// 配送料のIDの取得
export const getShippingRateId = ({ 
    totalQuantity 
}: { totalQuantity: number }) => {
    return totalQuantity >= STRIPE_SHIPPING_FREE_LIMIT
        ? process.env.STRIPE_SHIPPING_FREE_RATE_ID 
        : process.env.STRIPE_SHIPPING_REGULAR_RATE_ID;
}

// サブスクリプションの配送料の取得
export const getSubscriptionShippingFee = async ({
    session,
    subscriptionShippingFee
}: GetSubscriptionShippingFeeProps) => {
    try {
        if (!session?.subscription || typeof session.subscription !== 'string') {
            return {
                success: false,
                error: CHECKOUT_ERROR.SUBSCRIPTION_SHIPPING_FEE_FAILED,
                data: 0
            }
        }

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
            success: false,
            error: CHECKOUT_ERROR.SUBSCRIPTION_SHIPPING_FEE_FAILED,
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
        if (!session.payment_intent || typeof session.payment_intent !== 'string') {
            return {
                success: true,
                error: null,
                data: 'card'
            }
        }

        const sessionWithPaymentMethod = await stripe.paymentIntents.retrieve(
            session.payment_intent,
            { expand: ['payment_method'] }
        );

        if (sessionWithPaymentMethod.payment_method) {
            const paymentMethod = sessionWithPaymentMethod.payment_method;
            
            if (paymentMethod && typeof paymentMethod === 'object' && paymentMethod.card) {
                cardBrand = paymentMethod.card.brand || 'card';
            } else {
                cardBrand = 'card';
            }

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

// チェックアウトセッションの取得
export const getCheckoutSession = async ({ sessionId }: { 
    sessionId: StripeCheckoutSessionId 
}) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(
            sessionId, 
            { expand: ['line_items'] }
        );
        
        return {
            success: true,
            error: null,
            data: session,
        }
    } catch (error) {
        console.error('Database : Error in getCheckoutSession: ', error);

        return {
            success: false,
            error: CHECKOUT_ERROR.SESSION_RETRIEVAL_FAILED,
            data: null
        }
    }
}

// チェックアウトセッションの作成
export const createCheckoutSession = async ({ 
    lineItems, 
    userId,
    totalQuantity,
}: CreateCheckoutSessionProps) => {
    try {
        if (!lineItems || lineItems.length === 0) {
            return {
                success: false,
                error: CHECKOUT_ERROR.NO_LINE_ITEMS,
                data: null
            }
        }

        if (!userId) {
            return {
                success: false,
                error: CHECKOUT_ERROR.NO_USER_ID,
                data: null
            }
        }

        if (totalQuantity < 0) {
            return {
                success: false,
                error: CHECKOUT_ERROR.INVALID_QUANTITY,
                data: null
            }
        }

        // 1. 配送料の設定
        const shippingRateId = getShippingRateId({ totalQuantity });

        if (!shippingRateId) {
            return {
                success: false,
                error: CHECKOUT_ERROR.NO_SHIPPING_RATE_FOUND,
                data: null
            }
        }
            
        // 2. ユーザーのStripe顧客IDの取得
        const user = await getUser({
            userId: userId as UserId,
            getType: CUSTOMER_ID_DATA
        });

        if (!user) {
            return {
                success: false,
                error: USER_STRIPE_ERROR.CUSTOMER_ID_FETCH_FAILED,
                data: null
            }
        }

        const customerId = user?.user_stripes?.customer_id;
        
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
            success: !!session, 
            data: session
        }
    } catch (error) {
        console.error('Database : Error in createCheckoutSession: ', error);

        return {
            success: false,
            error: CHECKOUT_ERROR.CHECKOUT_SESSION_FAILED,
            data: null
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
    
        if (!interval || !shippingRateAmount.success) {
            return {
                success: false, 
                error: CHECKOUT_ERROR.NO_SUBSCRIPTION_INTERVAL
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
        ] as StripePaymentLinkCreateParams['line_items'];
    
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
            success: !!paymentLink, 
            data: paymentLink
        }
    } catch (error) {
        console.error('Database : Error in createPaymentLink: ', error);

        return {
            success: false,
            error: CHECKOUT_ERROR.PAYMENT_LINK_FAILED,
            data: null
        }
    }
}

export const processCheckoutItems = async ({
    userId,
    cartItems
}: ProcessCheckoutItemsProps) => {
    // 1. 商品の合計数量を計算
    const totalQuantity = cartItems.reduce((
        sum: number, 
        item: CartItemWithProduct
    ) => sum + item.quantity, CHECKOUT_INITIAL_QUANTITY);

    // 2. チェックアウトの商品リストを作成
    let lineItems: CheckoutLineItem[] = [];
    let serverCalculatedTotal = 0;

    for (const cartItem of cartItems) {
        const product = cartItem.product;

        if (!product) {
            return {
                success: false, 
                error: CHECKOUT_ERROR.NO_PRODUCT_DATA
            }
        }

        const priceId = product.product_stripes?.sale_price_id 
            || product.product_stripes?.regular_price_id;

        if (!priceId) {
            return {
                success: false, 
                error: CHECKOUT_ERROR.NO_PRICE_ID
            }
        }

        // 3. 価格の取得
        try {
            const price = await stripe.prices.retrieve(priceId);

            if (price.unit_amount === null) {
                console.error('Actions Error - Price unit_amount is null for price ID:', priceId);

                return {
                    success: false,
                    error: CHECKOUT_ERROR.NO_PRICE_AMOUNT
                }
            }
            
            const itemTotal = price.unit_amount * cartItem.quantity;
            serverCalculatedTotal += itemTotal;

            lineItems = [...lineItems, {
                price: priceId,
                quantity: cartItem.quantity,
            }];
        } catch (error) {
            console.error('Actions Error - Stripe Price Retrieve failed: ', error);

            return {
                success: false,
                error: CHECKOUT_ERROR.PRICE_VERIFICATION_FAILED
            }
        }
    }

    // 4. 配送料の取得
    const shippingRateId = getShippingRateId({ totalQuantity });

    if (!shippingRateId) {
        return {
            success: false,
            error: CHECKOUT_ERROR.NO_SHIPPING_RATE_ID
        }
    }

    let shippingFee = 0;
    try {
        const shippingRate = await stripe.shippingRates.retrieve(shippingRateId);
        shippingFee = shippingRate.fixed_amount?.amount || 0;
    } catch (error) {
        console.error('Actions Error - Stripe Shipping Rate Retrieve failed: ', error);

        return {
            success: false,
            error: CHECKOUT_ERROR.NO_SHIPPING_RATE_AMOUNT
        }
    }

    const finalTotal = serverCalculatedTotal + shippingFee;

    // 5. チェックアウトセッションの作成
    const { success, data } = await createCheckoutSession({ 
        lineItems, 
        userId,
        totalQuantity,
    })

    if (!success || !data) {
        return {
            success: false,
            error: CHECKOUT_ERROR.CHECKOUT_SESSION_FAILED
        }
    }

    // 6. 合計金額のチェック
    if (data.amount_total !== finalTotal) {
        console.error('Actions Error - Amount total mismatch:', data.amount_total, finalTotal);

        return {
            success: false,
            error: CHECKOUT_ERROR.AMOUNT_TOTAL_MISMATCH
        }
    }

    return {
        success: true,
        data: data
    }
}

export const processCheckoutSessionCompleted = async ({
    checkoutSessionEvent
}: { checkoutSessionEvent: StripeCheckoutSession }) => {
    try {
        // 1. 注文データの処理
        const { orderData, productDetailsData } = await processOrderData({
            checkoutSessionEvent
        });
    
        if (!orderData || !productDetailsData) {
            return {
                success: false,
                error: CHECKOUT_ERROR.ORDER_DATA_PROCESS_FAILED
            }
        }
    
        // 2. 在庫数と売り上げ数の更新
        const { 
            success: updateStockSuccess, 
            error: updateStockError 
        } = await updateProductStockAndSoldCount({ orderId: orderData.order.id });
    
        if (!updateStockSuccess) {
            return {
                success: false,
                error: updateStockError
            }
        }
    
        // 3. 配送先住所のデータ保存
        const userId = checkoutSessionEvent?.metadata?.userID as UserId;
    
        await processShippingAddress({
            checkoutSessionEvent,
            userId
        });
    
        // 4. 注文完了メールの送信
        const { 
            success: orderEmailSuccess, 
            error: orderEmailError 
        } = await sendOrderCompleteEmail({
            orderData: checkoutSessionEvent,
            productDetails: productDetailsData as StripeProductDetailsProps[],
            orderNumber: orderData.order.order_number
        });
    
        if (!orderEmailSuccess) {
            return {
                success: false,
                error: orderEmailError
            }
        }
    
        const isNotEventSubscription = checkoutSessionEvent.mode !== 'subscription';
    
        // 5. 未払いの場合のメール送信
        if (checkoutSessionEvent.payment_status !== 'paid' && isNotEventSubscription) {
            await sendOrderEmails({
                checkoutSessionEvent,
                productDetails: productDetailsData as StripeProductDetailsProps[],
                orderData
            });
        }
    
        // 6. Payment Link の無効化
        if (checkoutSessionEvent.payment_link && isNotEventSubscription) {
            const { 
                success: deactivateSuccess, 
                error: deactivateError 
            } = await deactivatePaymentLink({
                checkoutSessionEvent
            });
        
            if (!deactivateSuccess) {
                return {
                    success: false,
                    error: deactivateError
                };
            }
        }
    
        return {
            success: true,
            error: null
        }
    } catch (error) {
        console.error('Database : Error in processCheckoutSessionCompleted: ', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : CHECKOUT_ERROR.CHECKOUT_COMPLETED_FAILED;

        return {
            success: false,
            error: errorMessage
        }
    }
}