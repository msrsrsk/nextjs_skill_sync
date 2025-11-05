import { stripe } from "@/lib/clients/stripe/client"

import { getProductEffectivePrice } from "@/services/product/calculation"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHECKOUT_ERROR } = ERROR_MESSAGES;

interface ValidatePriceCalculationProps {
    clientCalculatedTotal: number;
    serverCalculatedTotal: number;
    dbBasedTotal: number;
}


export const calculateCheckoutTotals = async ({
    cartItems
}: { cartItems: CartItemWithProduct[] }) => {
    let lineItems: CheckoutLineItem[] = [];
    let serverCalculatedTotal = 0;
    let dbBasedTotal = 0;

    for (const cartItem of cartItems) {
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
            serverCalculatedTotal += itemTotal;

            const dbPrice = getProductEffectivePrice(product);
            dbBasedTotal += dbPrice * cartItem.quantity;

            lineItems = [...lineItems, {
                price: priceId,
                quantity: cartItem.quantity,
            }];
        } catch (error) {
            console.error('Actions Error - Stripe Price Retrieve failed: ', error);

            return {
                success: false,
                error: CHECKOUT_ERROR.PRICE_VERIFICATION_FAILED,
                data: null
            }
        }
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
    }

    return true;
}