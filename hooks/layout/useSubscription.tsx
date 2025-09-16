import { useEffect } from "react"

import { 
    useSubscriptionPurchaseTypeStore, 
    useSelectedSubscriptionOptionStore
} from "@/app/stores/useStore"
import { getDiscountRate } from "@/lib/utils/calculation"
import { SUBSCRIPTION_PURCHASE_TYPES } from "@/constants/index"

const { ONE_TIME, SUBSCRIPTION } = SUBSCRIPTION_PURCHASE_TYPES;

interface UseSubscriptionProps {
    product: Product;
    subscriptionOptions?: SubscriptionOption[];
}

const useSubscription = ({ 
    product, 
    subscriptionOptions 
}: UseSubscriptionProps) => {
    const { subscriptionPurchaseType, setSubscriptionPurchaseType } = useSubscriptionPurchaseTypeStore();
    const { selectedSubscriptionOption, setSelectedSubscriptionOption } = useSelectedSubscriptionOptionStore();
    
    const handlePurchaseTypeChange = (type: SubscriptionPurchaseType) => {
        if (!subscriptionOptions) return;

        setSubscriptionPurchaseType(type);

        if (type === ONE_TIME) {
            setSelectedSubscriptionOption(null);
        } else {
            const defaultOption = subscriptionOptions[0];
            setSelectedSubscriptionOption(defaultOption);
        }
    };

    const handleIntervalChange = (option: SubscriptionOption) => {
        setSelectedSubscriptionOption(option);
    };

    const calculateDiscountInfo = (option: SubscriptionOption) => {
        const discountRate = getDiscountRate(product.price, option.price);
        const showDiscount = discountRate > 0 && product.price > option.price;
        
        return { discountRate, showDiscount };
    };
    
    useEffect(() => {
        if (!subscriptionOptions) return;
        
        if (subscriptionOptions.length > 0) {
            setSubscriptionPurchaseType(SUBSCRIPTION);
            setSelectedSubscriptionOption(subscriptionOptions[0]);
        }
    }, []);

    return {
        subscriptionPurchaseType,
        subscriptionInterval: selectedSubscriptionOption?.interval,
        handlePurchaseTypeChange,
        handleIntervalChange,
        calculateDiscountInfo
    }
}

export default useSubscription