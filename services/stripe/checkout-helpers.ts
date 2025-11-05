import { stripe } from "@/lib/clients/stripe/client"

import { getProductEffectivePrice } from "@/services/product/calculation"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHECKOUT_ERROR } = ERROR_MESSAGES;

interface ProcessCartItemProps {
    cartItem: CartItemWithProduct;
    product: ProductWithRelations;
    priceId: string;
}

interface ValidatePriceCalculationProps {
    clientCalculatedTotal: number;
    serverCalculatedTotal: number;
    dbBasedTotal: number;
}

export const validateCartItem = (cartItem: CartItemWithProduct) => {
    const product = cartItem.product;

    if (!product) {
        return {
            success: false, 
            error: CHECKOUT_ERROR.NO_PRODUCT_DATA,
            data: null
        }
    }

    const priceId = product.product_stripes?.sale_price_id 
        || product.product_stripes?.regular_price_id;

    if (!priceId) {
        return {
            success: false, 
            error: CHECKOUT_ERROR.NO_PRICE_ID,
            data: null
        }
    }
    
    return {
        success: true,
        error: null,
        data: {
            product,
            priceId
        }
    }
}

export const processCartItem = async ({
    cartItem,
    product,
    priceId,
}: ProcessCartItemProps) => {
    try {
        const price = await stripe.prices.retrieve(priceId);

        if (price.unit_amount === null) {
            console.error('Actions Error - Price unit_amount is null for price ID:', priceId);

            return {
                success: false,
                error: CHECKOUT_ERROR.NO_PRICE_AMOUNT,
                data: null
            }
        }
        
        const itemTotal = price.unit_amount * cartItem.quantity;
        const dbPrice = getProductEffectivePrice(product);
        const dbTotal = dbPrice * cartItem.quantity;

        return {
            success: true,
            error: null,
            data: {
                lineItem: {
                    price: priceId,
                    quantity: cartItem.quantity,
                },
                serverTotal: itemTotal,
                dbTotal
            }
        }
    } catch (error) {
        console.error('Actions Error - Stripe Price Retrieve failed: ', error);

        return {
            success: false,
            error: CHECKOUT_ERROR.PRICE_VERIFICATION_FAILED,
            data: null
        }
    }
}

export const calculateCheckoutTotals = async ({
    cartItems
}: { cartItems: CartItemWithProduct[] }) => {
    let lineItems: CheckoutLineItem[] = [];
    let serverCalculatedTotal = 0;
    let dbBasedTotal = 0;

    for (const cartItem of cartItems) {
        const validateCartItemResult = validateCartItem(cartItem);

        if (!validateCartItemResult.success || !validateCartItemResult.data) {
            return {
                success: false,
                error: validateCartItemResult.error,
                data: null
            }
        }

        const { product, priceId } = validateCartItemResult.data;

        const processCartItemResult = await processCartItem({
            cartItem,
            product,
            priceId,
        });

        if (!processCartItemResult.success || !processCartItemResult.data) {
            return {
                success: false,
                error: processCartItemResult.error,
                data: null
            }
        }

        lineItems = [...lineItems, processCartItemResult.data.lineItem];

        serverCalculatedTotal += processCartItemResult.data.serverTotal;
        dbBasedTotal += processCartItemResult.data.dbTotal;
    }

    return {
        success: true,
        error: null,
        data: {
            lineItems,
            serverCalculatedTotal,
            dbBasedTotal
        }
    }
}

export const validatePriceCalculation = ({
    clientCalculatedTotal,
    serverCalculatedTotal,
    dbBasedTotal,
}: ValidatePriceCalculationProps) => {
    if (clientCalculatedTotal !== undefined) {
        if (clientCalculatedTotal !== serverCalculatedTotal 
            || clientCalculatedTotal !== dbBasedTotal
        ) {
            console.error('Actions Error - Amount total mismatch:', 
                clientCalculatedTotal, 
                serverCalculatedTotal, 
                dbBasedTotal
            );
            return false;
        }
    } else {
        if (serverCalculatedTotal !== dbBasedTotal) {
            console.error('Actions Error - Amount total mismatch (server vs db):', 
                serverCalculatedTotal, 
                dbBasedTotal
            );
            return false;
        }
    }

    return true;
}