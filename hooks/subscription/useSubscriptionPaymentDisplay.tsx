import { SUBSCRIPTION_PAYMENT_STATUS } from "@/constants/index"

const { PENDING, PAST_DUE, FAILED, CANCELED } = SUBSCRIPTION_PAYMENT_STATUS;

type SubscriptionPaymentSelectFields = Pick<SubscriptionPayment, 'id' | 'payment_date' | 'status'>;

interface SubscriptionPaymentDisplayProps {
    subscriptionPayments: SubscriptionPaymentSelectFields[];
    maxItems: number;
}

interface DisplayDataItem {
    payment: SubscriptionPaymentSelectFields;
    originalIndex: number;
}

const useSubscriptionPaymentDisplay = ({
    subscriptionPayments,
    maxItems
}: SubscriptionPaymentDisplayProps) => {

    const getDisplayData = (): DisplayDataItem[] => {
        if (subscriptionPayments.length <= maxItems) {
            return subscriptionPayments
                .slice(0, maxItems)
                .map((
                    payment: SubscriptionPaymentSelectFields, 
                    index: number
                ) => (
            { payment, originalIndex: index }));
        } else {
            const firstItem = { payment: subscriptionPayments[0], originalIndex: 0 };
            const lastItems = subscriptionPayments
                .slice(-(maxItems - 1))
                .map((payment: SubscriptionPaymentSelectFields, index: number) => ({
                    payment,
                    originalIndex: subscriptionPayments.length - (maxItems - 1) + index
                }));
            return [firstItem, ...lastItems];
        }
    };
    
    const getCheckIconColor = (index: number) => {
        const currentPayment = subscriptionPayments[index];
        const paymentStatus = currentPayment?.status;

        if ([PENDING, PAST_DUE, FAILED].includes(paymentStatus)) return '#999999';
        if (paymentStatus === CANCELED) return '#FF4D4D';
        if (subscriptionPayments.length === 1 
            || index === subscriptionPayments.length - 1) return '#39cc6f';
        return '#C2EED2';
    }

    const getPaymentSubtext = (index: number) => {
        const currentPayment = subscriptionPayments[index];
        const paymentStatus = currentPayment?.status;
        
        if ([PENDING, PAST_DUE, FAILED].includes(paymentStatus)) return '支払い失敗';
        if (paymentStatus === CANCELED) return 'キャンセル';
        if (index === 0) return '契約開始';
        if (index === subscriptionPayments.length - 1) return '最近の契約';
        return null;
    }

    return {
        getDisplayData,
        getCheckIconColor,
        getPaymentSubtext
    }
}

export default useSubscriptionPaymentDisplay