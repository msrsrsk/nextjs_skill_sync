import { stripe } from "@/lib/clients/stripe/client"

import { sendSubscriptionPaymentRequestEmail } from "@/services/email/subscription/subscription-payment-request"
import { createSubscriptionPayment } from "@/services/subscription-payment/actions"
import { formatStripeSubscriptionStatus } from "@/services/subscription-payment/format"
import { createCheckoutOrder, deleteOrder } from "@/services/order/actions"
import { createOrderStripe, deleteOrderStripe } from "@/services/order-stripe/actions"
import { createOrderItems, deleteAllOrderItem } from "@/services/order-item/actions"
import { createOrderItemStripes } from "@/services/order-item-stripe/actions"
import { 
    createOrderItemSubscriptions, 
    deleteOrderItemSubscription 
} from "@/services/order-item-subscription/actions"
import { getShippingAddressRepository } from "@/repository/shippingAddress"
import { createShippingAddress } from "@/services/shipping-address/actions"
import { 
    createStripeProduct, 
    createStripePrice, 
    createSubscriptionPrices,
    updateCustomerShippingAddress,
} from "@/services/stripe/actions"
import { sendPaymentRequestEmail } from "@/services/email/order/payment-request"
import { NOIMAGE_PRODUCT_IMAGE_URL, SUBSCRIPTION_STATUS } from "@/constants/index"

const { SUBS_ACTIVE } = SUBSCRIPTION_STATUS;

interface CreateProductDetailsProps {
    lineItems: StripeCheckoutSessionLineItem[] | StripeSubscriptionItem[];
    subscriptionId: string;
    isCheckout: boolean;
}

interface ProcessShippingAddressProps {
    checkoutSessionEvent: StripeCheckoutSession, 
    userId: UserId
}

interface SendOrderEmailsProps {
    checkoutSessionEvent: StripeCheckoutSession,
    productDetails: StripeProductDetailsProps[],
    orderData: CreateCheckoutOrderData
}

interface CreateStripeProductDataProps {
    title: ProductTitle;
    productId: ProductId;
    price: ProductPrice;
    salePrice: ProductSalePrice;
    subscriptionPriceIds: StripeSubscriptionPriceIds;
}

// 商品詳細データの作成
export async function createProductDetails({
    lineItems,
    subscriptionId,
    isCheckout = true
}: CreateProductDetailsProps) {
    const productDetails = await Promise.all(
        lineItems.map(async (item) => {
            const product = await stripe.products.retrieve(item.price?.product as string);
            
            const baseProductData = {
                product_id: product.metadata.supabase_id,
                image: product.images[0] || process.env.NEXT_PUBLIC_BASE_URL + NOIMAGE_PRODUCT_IMAGE_URL,
                unit_price: item.price?.unit_amount,
                amount: isCheckout ? item.amount_total : item.price?.unit_amount,
                quantity: item.quantity,
                stripe_price_id: item.price?.id,
                subscription_id: subscriptionId,
                subscription_status: (item.price?.recurring?.interval_count && item.price?.recurring?.interval) 
                    ? SUBS_ACTIVE 
                    : null,                    
                subscription_interval: (item.price?.recurring?.interval_count && item.price?.recurring?.interval) 
                    ? `${item.price?.recurring?.interval_count}${item.price?.recurring?.interval}` 
                    : null,           
                ...(product.metadata.subscription_product === 'true' && {
                    subscription_product: true
                })         
            };

            try {
                return {
                    ...baseProductData,
                    title: product.name
                }
            } catch (error) {
                console.error('Webhook Error - Error in Subscription Retrieving Product:', error);
                
                return {
                    ...baseProductData,
                    title: 'No Product Title'
                }
            }
        })
    )

    return productDetails
}

// 注文データの処理
export async function processOrderData({
    checkoutSessionEvent
}: { checkoutSessionEvent: StripeCheckoutSession }) {
    // 1.注文データの取得と保存
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        checkoutSessionEvent.id, 
        { expand: ['line_items'] }
    );
    const lineItems = sessionWithLineItems.line_items?.data || [];

    const productDetails = await createProductDetails({
        lineItems,
        subscriptionId: checkoutSessionEvent.subscription,
        isCheckout: true
    });

    // Order テーブルのデータ作成
    const { 
        success: orderSuccess, 
        data: orderData,
        error: orderError, 
    } = await createCheckoutOrder({ session: checkoutSessionEvent });

    if (!orderSuccess || !orderData) {
        throw new Error(orderError as string);
    }

    // OrderStripe テーブルのデータ作成
    const { 
        success: orderStripeSuccess, 
        error: orderStripeError, 
    } = await createOrderStripe({ 
        orderStripeData: {
            order_id: orderData.order.id,
            session_id: checkoutSessionEvent.id,
            payment_intent_id: checkoutSessionEvent.payment_intent,
        }
    });

    if (!orderStripeSuccess) {
        await deleteOrder({ orderId: orderData.order.id });
        throw new Error(orderStripeError as string);
    }

    // OrderItems テーブルのデータ作成
    const  { 
        success: orderItemsSuccess, 
        error: orderItemsError,
        data: orderItemsData
    } = await createOrderItems({
        orderId: orderData.order.id, 
        productDetails: productDetails as StripeProductDetailsProps[]
    });

    if (!orderItemsSuccess || !orderItemsData) {
        await deleteOrder({ orderId: orderData.order.id });
        await deleteOrderStripe({ orderId: orderData.order.id });
        throw new Error(orderItemsError as string);
    }

    // OrderItemSubscriptions テーブルのデータ作成
    const  { 
        success: orderItemSubscriptionsSuccess, 
        error: orderItemSubscriptionsError 
    } = await createOrderItemSubscriptions({
        orderItemId: orderData.order.id, 
        productDetails: productDetails as StripeProductDetailsProps[]
    })

    if (!orderItemSubscriptionsSuccess) {
        await deleteOrder({ orderId: orderData.order.id });
        await deleteOrderStripe({ orderId: orderData.order.id });
        await deleteAllOrderItem({ orderId: orderData.order.id });
        throw new Error(orderItemSubscriptionsError as string);
    }

    // OrderItemStripes テーブルのデータ作成
    const  { 
        success: orderItemStripesSuccess, 
        error: orderItemStripesError 
    } = await createOrderItemStripes({
        orderItemIds: orderItemsData.map((item) => item.id), 
        productDetails: productDetails as StripeProductDetailsProps[]
    })

    if (!orderItemStripesSuccess) {
        await deleteOrder({ orderId: orderData.order.id });
        await deleteOrderStripe({ orderId: orderData.order.id });
        await deleteAllOrderItem({ orderId: orderData.order.id });
        await deleteOrderItemSubscription({ orderItemId: orderItemsData[0].id });
        throw new Error(orderItemStripesError as string);
    }

    return { orderData, productDetails }
}

// 配送先住所のデータ保存
export async function processShippingAddress({
    checkoutSessionEvent,
    userId
}: ProcessShippingAddressProps) {
    const repository = getShippingAddressRepository();
    const defaultShippingAddress = await repository.getUserDefaultShippingAddress({
        userId
    });
    
    // デフォルトの配送先住所の有無確認（ない場合）
    if (!defaultShippingAddress) {
        const customerId = checkoutSessionEvent?.customer as string;

        // デフォルトの配送先住所のデータ保存
        const customerDetails = checkoutSessionEvent.customer_details;

        if (customerDetails && customerId) {
            const address = customerDetails.address;

            const { 
                success: createAddressSuccess, 
                error: createAddressError 
            } = await createShippingAddress({
                address: {
                    user_id: userId,
                    name: customerDetails.name,
                    postal_code: address?.postal_code,
                    state: address?.state,
                    city: address?.city || '',
                    address_line1: address?.line1,
                    address_line2: address?.line2 || '',
                    is_default: true
                } as ShippingAddress
            })

            if (!createAddressSuccess) {
                throw new Error(createAddressError as string);
            }

            const { 
                success: updateCustomerAddressSuccess, 
                error: updateCustomerAddressError 
            } = await updateCustomerShippingAddress(customerId, {
                address: {
                    line1: address?.line1,
                    line2: address?.line2 || '',
                    city: address?.city || '',
                    state: address?.state,
                    postal_code: address?.postal_code
                },
                name: customerDetails.name,
            });

            if (!updateCustomerAddressSuccess) {
                throw new Error(updateCustomerAddressError as string);
            }
        }
    }
}

// 未払いの場合のメール送信
export async function sendOrderEmails({
    checkoutSessionEvent,
    productDetails,
    orderData
}: SendOrderEmailsProps) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
        checkoutSessionEvent.payment_intent
    );
    
    const { 
        success: paymentEmailSuccess, 
        error: paymentEmailError 
    } = await sendPaymentRequestEmail({
        orderData: checkoutSessionEvent,
        productDetails: productDetails as StripeProductDetailsProps[],
        orderNumber: orderData.order.order_number,
        paymentIntent
    });

    if (!paymentEmailSuccess) {
        throw new Error(paymentEmailError as string);
    }
}

// サブスクリプションの支払いデータの作成と未払い通知メールの送信
export async function handleSubscriptionEvent({
    subscriptionEvent
}: { subscriptionEvent: StripeSubscription }) {
    const subscriptionStatus = formatStripeSubscriptionStatus(subscriptionEvent?.status);

    // 1. サブスクリプションの支払いデータの作成
    const { 
        success: subscriptionPaymentSuccess, 
        error: subscriptionPaymentError 
    } = await createSubscriptionPayment({
        subscriptionPaymentData: {
            user_id: subscriptionEvent?.metadata?.userID as UserId,
            subscription_id: subscriptionEvent.id,
            payment_date: new Date(),
            status: subscriptionStatus,
        } as SubscriptionPayment
    });

    if (!subscriptionPaymentSuccess) {
        throw new Error(subscriptionPaymentError as string);
    }

    // 2. 未払い通知メールの送信
    if (subscriptionEvent?.status !== 'active') {
        const subscription = await stripe.subscriptions.retrieve(subscriptionEvent.id);
        const lineItems = subscription.items.data || [];

        const productDetails = await createProductDetails({
            lineItems,
            subscriptionId: subscriptionEvent.id,
            isCheckout: false
        });

        const { 
            success: subscriptionPaymentEmailSuccess, 
            error: subscriptionPaymentEmailError 
        } = await sendSubscriptionPaymentRequestEmail({
            orderData: subscriptionEvent,
            productDetails: productDetails as StripeProductDetailsProps[],
        });

        if (!subscriptionPaymentEmailSuccess) {
            throw new Error(subscriptionPaymentEmailError as string);
        }
    }
}

// Stripe商品データの作成
export async function createStripeProductData({
    title,
    productId,
    price,
    salePrice,
    subscriptionPriceIds
}: CreateStripeProductDataProps) {

    let stripeSalePriceId = null;

    // 1. Stripe商品の作成
    const { 
        success: productSuccess, 
        data: productData, 
        error: productError 
    }  = await createStripeProduct({
        name: title,
        metadata: {
            supabase_id: productId,
            ...(subscriptionPriceIds && {
                subscription_product: true
            })
        }
    })

    if (!productSuccess || !productData) {
        throw new Error(productError as string);
    }

    // 2. Stripe価格の作成
    const { 
        success: priceSuccess, 
        data: priceData, 
        error: priceError 
    } = await createStripePrice({
        product: productData.id,
        unit_amount: price,
        currency: 'jpy',
        ...(salePrice && {
            nickname: '通常価格',
        })
    });

    if (!priceSuccess || !priceData) {
        throw new Error(priceError as string);
    }

    // 3. Stripeセール価格の作成
    if (salePrice) {
        const { 
            success: salePriceSuccess, 
            data: salePriceData, 
            error: salePriceError 
        } = await createStripePrice({
            product: productData.id,
            unit_amount: salePrice,
            currency: 'jpy',
            nickname: 'セール価格',
        });

        if (!salePriceSuccess || !salePriceData) {
            throw new Error(salePriceError as string);
        }

        stripeSalePriceId = salePriceData.id;
    }

    // 4. Stripeサブスクリプション価格の作成
    const updatedSubscriptionPriceIds = await createSubscriptionPrices({
        productData,
        subscriptionPriceIds
    });

    return {
        productData,
        priceData,
        stripeSalePriceId,
        updatedSubscriptionPriceIds
    }
}