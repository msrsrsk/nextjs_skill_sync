import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

import { createStripeProduct, createStripePrice } from "@/services/stripe/actions"
import { updateProduct } from "@/services/product/actions"
import { getRecurringConfig, formatCreateSubscriptionNickname } from "@/services/subscription-payment/format"
import { extractCreateSubscriptionPrices, extractUpdatedSubscriptionPriceIds } from "@/lib/utils/extractors"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_ERROR, SUBSCRIPTION_ERROR } = ERROR_MESSAGES;

export async function POST(request: NextRequest) {   
    try {
        const headersList = await headers();
    
        const authHeader = headersList.get('authorization');
        const signatureHeader = headersList.get('x-webhook-signature');
        
        const expectedAuth = `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET_KEY}`;
        const expectedSignature = process.env.SUPABASE_WEBHOOK_SIGNATURE;
        
        if (authHeader !== expectedAuth || signatureHeader !== expectedSignature) {
            return NextResponse.json(
                { message: PRODUCT_ERROR.STRIPE_WEBHOOK_PROCESS_FAILED }, 
                { status: 400 }) 
        }

        const { record } = await request.json();

        const { 
            id, 
            title, 
            price, 
            sale_price,
            stripe_subscription_price_ids
        } = record;

        const { 
            success: productSuccess, 
            data: productData, 
            error: productError 
        }  = await createStripeProduct({
            name: title,
            metadata: {
                supabase_id: id,
                ...(stripe_subscription_price_ids && {
                    subscription_product: true
                })
            }
        });

        if (!productSuccess || !productData) {
            return NextResponse.json(
                { message: productError },
                { status: 500 }) 
        }

        const { 
            success: priceSuccess, 
            data: priceData, 
            error: priceError 
        } = await createStripePrice({
            product: productData.id,
            unit_amount: price,
            currency: 'jpy',
            ...(sale_price && {
                nickname: '通常価格',
            })
        });

        if (!priceSuccess || !priceData) {
            return NextResponse.json(
                { message: priceError },
                { status: 500 }) 
        }

        let stripeSalePriceId = null;

        if (sale_price) {
            const { 
                success: salePriceSuccess, 
                data: salePriceData, 
                error: salePriceError 
            } = await createStripePrice({
                product: productData.id,
                unit_amount: sale_price,
                currency: 'jpy',
                nickname: 'セール価格',
            });

            if (!salePriceSuccess || !salePriceData) {
                return NextResponse.json(
                    { message: salePriceError },
                    { status: 500 }) 
            }

            stripeSalePriceId = salePriceData.id;
        }

        let updatedSubscriptionPriceIds = stripe_subscription_price_ids;

        if (stripe_subscription_price_ids) {
            const subscriptionPrices = extractCreateSubscriptionPrices(stripe_subscription_price_ids);
            
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
                    };
                })
            );

            const successfulPrices = subscriptionPriceResults.filter(result => result !== null);

            updatedSubscriptionPriceIds = extractUpdatedSubscriptionPriceIds(
                stripe_subscription_price_ids, 
                successfulPrices
            );
        }

        const { 
            success: updateSuccess, 
            error: updateError 
        } = await updateProduct({
            productId: id,
            data: {
                stripe_product_id: productData.id,
                stripe_regular_price_id: priceData.id,
                ...(sale_price && stripeSalePriceId && {
                    stripe_sale_price_id: stripeSalePriceId
                }),
                ...(stripe_subscription_price_ids && {
                    stripe_subscription_price_ids: updatedSubscriptionPriceIds
                })
            }
        });

        if (!updateSuccess) {
            return NextResponse.json(
                { message: updateError },
                { status: 500 }) 
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook Error - Product POST error:', error);

        const errorMessage = 
            error instanceof Error 
            ? error.message : PRODUCT_ERROR.STRIPE_WEBHOOK_PROCESS_FAILED;

        return NextResponse.json(
            { message: errorMessage }, 
            { status: 500 }
        );
    } 
}