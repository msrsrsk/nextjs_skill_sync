import { formatSubscriptionIntervalForOrder } from "@/services/subscription-payment/format"

export const formatOrderRemarks = (item: {
    subscription_interval: string | null;
    subscription_product: boolean | null;
}): string => {
    if (!item.subscription_interval && item.subscription_product) {
        return '通常購入：1回のみの購入';
    }
    
    if (item.subscription_interval && item.subscription_product) {
        return formatSubscriptionIntervalForOrder(item.subscription_interval);
    }
    
    return '';
}