import { useState } from "react"

import { SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBSCRIPTION_CANCEL_API_PATH } = SITE_MAP;
const { SUBSCRIPTION_ERROR } = ERROR_MESSAGES;

const useSubscriptionCancel = ({ 
    subscriptionId 
}: { subscriptionId: OrderItemSubscriptionId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const cancelSubscription = async () => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(SUBSCRIPTION_CANCEL_API_PATH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscriptionId })
            });

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.message);
                setSuccess(false);
            }
        } catch (error) {
            console.error('Hook Error - Subscription Cancel error:', error);
            setError(SUBSCRIPTION_ERROR.CANCEL_SUBSCRIPTION_FAILED);
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        success,
        cancelSubscription
    }
}

export default useSubscriptionCancel