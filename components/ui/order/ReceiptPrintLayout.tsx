import dynamic from "next/dynamic"
import { Suspense } from "react"

import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import { getOrderRepository } from "@/repository/order"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ORDER_ERROR } = ERROR_MESSAGES;

interface ReceiptPrintLayoutProps {
    params: { id: OrderId };
    isSubscription?: boolean;
    subscriptionPaymentId?: PaymentSubscriptionId;
}

interface ReceiptPrintWrapperProps {
    id: OrderId;
    isSubscription?: boolean;
    subscriptionPaymentId?: PaymentSubscriptionId;
}

const ReceiptPrintLayout = ({ 
    params,
    isSubscription = false,
    subscriptionPaymentId
}: ReceiptPrintLayoutProps) => {
    const { id } = params;

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ReceiptPrintWrapper 
                id={id}
                isSubscription={isSubscription}
                subscriptionPaymentId={subscriptionPaymentId}
            />
        </Suspense>
    )
}

const ReceiptPrintWrapper = async ({ 
    id, 
    isSubscription = false,
    subscriptionPaymentId
}: ReceiptPrintWrapperProps) => {
    const repository = getOrderRepository();
    const orderResult = await repository.getOrderById({
        orderId: id,
        isSubscription
    });

    if (!orderResult) {
        return (
            <div className="w-screen h-screen grid place-items-center">
                <ErrorMessage message={ORDER_ERROR.DETAIL_FETCH_FAILED} />
            </div>
        )
    }

    return (
        <ReceiptPrintContent 
            order={orderResult as OrderWithSelectFields} 
            isSubscription={isSubscription}
            subscriptionPaymentId={subscriptionPaymentId}
        />
    )
}

const ReceiptPrintContent = dynamic(
    () => import('@/components/ui/order/ReceiptPrintContent'), {
        ssr: false,
        loading: () => <LoadingSpinner />
    }
)

export default ReceiptPrintLayout