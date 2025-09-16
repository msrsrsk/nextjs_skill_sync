import { formatTitleCase } from "@/lib/utils/format"
import { 
    NOIMAGE_PRODUCT_IMAGE_URL, 
    CATEGORY_TAGS,
    SUBSCRIPTION_SETTINGS,
    SITE_MAP, 
} from "@/constants/index"

const { ACTIVE_TAG } = CATEGORY_TAGS;
const { PRICE_PREFIX_LENGTH, BASE_RADIX } = SUBSCRIPTION_SETTINGS;
const { CATEGORY_PATH } = SITE_MAP;

export function extractProductLink(content: string): string | null {
    if (!content) return null;
    
    const productLinkMatch = content.match(/<a[^>]*href="([^"]*)"[^>]*>商品を見る<\/a>/);
    
    if (productLinkMatch && productLinkMatch[1]) {
        return productLinkMatch[1];
    }
    
    return null;
}

export const extractSyncLogData = (productLink: string | null) => {
    const extractImageUrl = (url: string) => {
        return url ? url.split(`${CATEGORY_PATH}/`)[1] : NOIMAGE_PRODUCT_IMAGE_URL;
    };

    const extractCategoryName = (url: string) => {
        if (!url) return ACTIVE_TAG;
        
        const categoryPart = url.split(`${CATEGORY_PATH}/`)[1]?.split('/')[0];
        if (!categoryPart) return ACTIVE_TAG;
        
        return formatTitleCase(categoryPart);
    };

    const extractProductName = (url: string) => {
        if (!url) return "No Product Name";
        
        return url
            .substring(url.lastIndexOf('/') + 1)
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return {
        imageUrl: extractImageUrl(productLink || ''),
        categoryName: extractCategoryName(productLink || ''),
        productName: extractProductName(productLink || '')
    };
};

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
};

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
};

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
};

export const extractSubscriptionPaymentLinks = (paymentLinks: string) => {
    if (!paymentLinks) return [];

    const links = paymentLinks.split('\n');

    return links
        .map((link: string) => {
            const firstUnderscoreIndex = link.indexOf('_');
            if (firstUnderscoreIndex === -1) return null;
            
            const interval = link.substring(0, firstUnderscoreIndex);
            const url = link.substring(firstUnderscoreIndex + 1);
            
            return { interval, url };
        })
        .filter(item => item && item.url);
};