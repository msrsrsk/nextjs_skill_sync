import { SUBSCRIPTION_INTERVALS, SUBSCRIPTION_INTERVAL_THRESHOLDS } from "@/constants/index"

const { 
    INTERVAL_DAY, 
    INTERVAL_WEEK, 
    INTERVAL_MONTH, 
    INTERVAL_3MONTH, 
    INTERVAL_6MONTH, 
    INTERVAL_YEAR 
} = SUBSCRIPTION_INTERVALS;
const { THRESHOLD_3MONTH, THRESHOLD_6MONTH } = SUBSCRIPTION_INTERVAL_THRESHOLDS;

export const formatSubscriptionInterval = (interval: string): string => {
    const intervalMap: Record<string, string> = {
        [INTERVAL_DAY]: '毎日',
        [INTERVAL_WEEK]: '毎週',
        [INTERVAL_MONTH]: '1ヶ月毎',
        [INTERVAL_3MONTH]: '3ヶ月毎',
        [INTERVAL_6MONTH]: '6ヶ月毎',
        [INTERVAL_YEAR]: '1年毎',
    }
    
    return intervalMap[interval] || interval;
}

export const formatSubscriptionIntervalForOrder = (interval: string): string => {
    const intervalMap: Record<string, string> = {
        '1day': '継続購入：毎日',
        '1week': '継続購入：毎週',
        '1month': '継続購入：1ヶ月毎',
        '3month': '継続購入：3ヶ月毎',
        '6month': '継続購入：6ヶ月毎',
    }
    
    return intervalMap[interval] || interval;
}

export const formatStripeSubscriptionStatus = (stripeStatus: string): SubscriptionPaymentStatus => {
    const statusMap: Record<string, SubscriptionPaymentStatus> = {
        'past_due': 'failed',
        'active': 'succeeded',
        'unpaid': 'failed',
        'canceled': 'canceled',
    }
    
    return statusMap[stripeStatus] || 'pending';
}

export const formatCreateSubscriptionNickname = (interval: string): string => {
    const intervalMap: Record<string, string> = {
        'day': '1日毎価格',
        'week': '1週間毎価格',
        'month': '1ヶ月毎価格',
        '3month': '3ヶ月毎価格',
        '6month': '6ヶ月毎価格',
        'year': '1年毎価格',
    }

    return intervalMap[interval] || interval;
}

export const getRecurringConfig = (interval: string) => {
    switch (interval) {
        case INTERVAL_DAY:
            return { interval: 'day' };
        case INTERVAL_WEEK:
            return { interval: 'week' };
        case INTERVAL_MONTH:
            return { interval: 'month' };
        case INTERVAL_3MONTH:
            return { interval: 'month', interval_count: THRESHOLD_3MONTH };
        case INTERVAL_6MONTH:
            return { interval: 'month', interval_count: THRESHOLD_6MONTH };
        case INTERVAL_YEAR:
            return { interval: 'year' };
        default:
            return null;
    }
}