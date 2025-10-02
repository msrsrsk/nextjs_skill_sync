import { SUBSCRIPTION_SETTINGS } from "@/constants/index"

const { PRICE_PREFIX_LENGTH, BASE_RADIX } = SUBSCRIPTION_SETTINGS;

export const extractCreateSubscriptionPrices = (
    priceIds: StripeSubscriptionPriceIds
) => {
    if (!priceIds) return [];
  
    const prices = priceIds.split('\n');
    
    return prices
        .map((price: string) => {
            const trimmedPrice = price.trim();
            if (!trimmedPrice) return null;
            
            const underscoreIndex = trimmedPrice.indexOf('_');
            if (underscoreIndex === -1) return null;
            
            const interval = trimmedPrice.substring(0, underscoreIndex);
            const priceStr = trimmedPrice.substring(underscoreIndex + 1);
            
            if (!priceStr) return null;
            
            const priceAmount = parseInt(priceStr, 10);
            
            return {
                interval: interval.trim(),
                price: isNaN(priceAmount) ? undefined : priceAmount
            };
        })
        .filter((price) => price !== null && price.price !== undefined);
}

export const extractSubscriptionPrices = (
    priceIds: StripeSubscriptionPriceIds
) => {
    if (!priceIds) return [];
  
    const prices = priceIds.split('\n');
    
    return prices
        .map((price: string) => {
            const firstUnderscoreIndex = price.indexOf('_');
            if (firstUnderscoreIndex === -1) return null;
            
            const interval = price.substring(0, firstUnderscoreIndex);
            const remainingPart = price.substring(firstUnderscoreIndex + 1);
            
            if (remainingPart && remainingPart.startsWith('price_')) {
                const secondUnderscoreIndex = remainingPart.indexOf('_', PRICE_PREFIX_LENGTH);
                
                if (secondUnderscoreIndex !== -1) {
                    const priceId = remainingPart.substring(0, secondUnderscoreIndex);
                    const priceStr = remainingPart.substring(secondUnderscoreIndex + 1);
                    const price = parseInt(priceStr, BASE_RADIX);
                    
                    return {
                        interval: interval.trim(),
                        priceId: priceId.trim(),
                        price: isNaN(price) ? undefined : price
                    };
                } else {
                    return {
                        interval: interval.trim(),
                        priceId: remainingPart.trim(),
                        price: undefined
                    };
                }
            }
            
            return null;
        })
        .filter((price) => price !== null);
}

export const extractUpdatedSubscriptionPriceIds = (
    stripe_subscription_price_ids: StripeSubscriptionPriceIds,
    successfulPrices: SubscriptionOption[]
) => {
    if (!stripe_subscription_price_ids) return [];

    return stripe_subscription_price_ids
        .split('\n')
        .map(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return line;
            
            const underscoreIndex = trimmedLine.indexOf('_');
            if (underscoreIndex === -1) return line;
            
            const interval = trimmedLine.substring(0, underscoreIndex);
            const priceStr = trimmedLine.substring(underscoreIndex + 1);
            
            if (priceStr) {
                const successfulPrice = successfulPrices.find(p => p?.interval === interval);
                if (successfulPrice) {
                    return `${interval}_${successfulPrice.priceId}_${priceStr}`;
                }
            }
            
            return line;
        })
        .join('\n');
}