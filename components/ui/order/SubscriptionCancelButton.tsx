"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"

import ConfirmModal from "@/components/common/modals/ConfirmModal"
import useSubscriptionCancel from "@/hooks/subscription/useSubscriptionCancel"
import PendingContent from "@/components/common/buttons/PendingContent"
import useToastNotifications from "@/hooks/notification/useToastNotifications"
import { EventButtonPrimary } from "@/components/common/buttons/Button"
import { showSuccessToast } from "@/components/common/display/Toasts"
import { isWithinThreshold } from "@/lib/utils/calculation"
import { 
    BUTTON_SIZES, 
    BUTTON_TEXT_TYPES, 
    SUBSCRIPTION_CANCEL_THRESHOLD, 
    SITE_MAP 
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { SUBSCRIPTION_HISTORY_PATH } = SITE_MAP;
const { SUBSCRIPTION_ERROR } = ERROR_MESSAGES;

interface SubscriptionCancelButtonProps {
    subscriptionId: OrderItemSubscriptionId;
    createdAt: OrderCreatedAt;
}

const SubscriptionCancelButton = ({ 
    subscriptionId,
    createdAt,
}: SubscriptionCancelButtonProps) => {
    const [modalActive, setModalActive] = useState(false);

    const router = useRouter();

    const { 
        loading,
        error: subscriptionError,
        success: subscriptionSuccess,
        cancelSubscription,
    } = useSubscriptionCancel({ subscriptionId });

    const isWithin = useMemo(() => {
        return isWithinThreshold(createdAt, SUBSCRIPTION_CANCEL_THRESHOLD);
    }, [createdAt]);

    const handleCancelSubscription = async () => {
        cancelSubscription();
    }

    useToastNotifications({
        error: subscriptionError,
        successMessage: subscriptionError as string,
        timestamp: Date.now()
    });

    useEffect(() => {
        if (subscriptionSuccess) {
            setModalActive(false);
            router.push(SUBSCRIPTION_HISTORY_PATH);
            showSuccessToast(SUBSCRIPTION_ERROR.CANCEL_SUBSCRIPTION_SUCCESS);
        }
    }, [subscriptionSuccess]);

    return <>
        <div className="grid gap-1">
            {isWithin && (
                <p className="text-sm leading-7 text-error text-center">
                    {SUBSCRIPTION_CANCEL_THRESHOLD} ヶ月経過後に解約可能
                </p>
            )}
            <EventButtonPrimary
                size={BUTTON_LARGE}
                text={BUTTON_JA}
                onClick={() => setModalActive(true)}
                // disabled={loading || isWithin}
                disabled={loading}
            >
                <PendingContent pending={loading} text="契約をキャンセル" />
            </EventButtonPrimary>
        </div>

        <ConfirmModal 
            text="契約をキャンセルしますか？"
            modalActive={modalActive}
            setModalActive={setModalActive}
            onConfirm={handleCancelSubscription}
        />
    </>
}

export default SubscriptionCancelButton