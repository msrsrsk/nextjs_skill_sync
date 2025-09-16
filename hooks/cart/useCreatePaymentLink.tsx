import { useState } from "react"

import { showErrorToast } from "@/components/common/display/Toasts"
import { SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBSCRIPTION_CHECK_API_PATH, SUBSCRIPTION_CHECKOUT_API_PATH } = SITE_MAP;
const { CHECKOUT_ERROR } = ERROR_MESSAGES;

interface UseCreatePaymentLinkProps {
    subscriptionPriceId: string | null;
    productId: ProductId;
    interval: string | null;
}

const useCreatePaymentLink = ({ 
    subscriptionPriceId,
    productId,
    interval
}: UseCreatePaymentLinkProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // サブスク契約状況の確認
    const checkSubscription = async () => {
        const response = await fetch(SUBSCRIPTION_CHECK_API_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId })
        });

        const { success, data } = await response.json();

        if (!success) {
            setError(CHECKOUT_ERROR.FETCH_SUBSCRIPTION_FAILED);
            return { proceed: false };
        }

        if (data) {
            showErrorToast(CHECKOUT_ERROR.ALREADY_SUBSCRIBED);
            return { proceed: false };
        }

        return { proceed: true };
    }


    // 支払いリンクの作成
    const createPaymentLink = async () => {
        setLoading(true);
        setError(null);

        try {
            if (!subscriptionPriceId) {
                throw new Error(CHECKOUT_ERROR.NOT_PROCEED_PAYMENTLINK);
            }

            const { proceed } = await checkSubscription();

            if (!proceed) return;

            const response = await fetch(SUBSCRIPTION_CHECKOUT_API_PATH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscriptionPriceId, interval })
            });

            const { success, data: paymentLinkData } = await response.json();

            if (success && paymentLinkData?.url) {
                window.open(paymentLinkData.url, '_blank', 'noopener');
            } else {
                throw new Error(CHECKOUT_ERROR.PAYMENT_LINK_FAILED);
            }
        } catch (error) {
            console.error('Hook Error - Payment Link error:', error);
            setError(CHECKOUT_ERROR.NOT_PROCEED_PAYMENTLINK);
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        createPaymentLink
    }
}

export default useCreatePaymentLink