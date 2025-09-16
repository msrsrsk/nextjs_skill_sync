import { Metadata } from "next"

import ReceiptPrintLayout from "@/components/ui/order/ReceiptPrintLayout"
import { generatePageMetadata } from "@/lib/metadata/page"
import { SITE_MAP } from "@/constants/index"

const { SUBSCRIPTION_HISTORY_PATH, PRINT_PATH } = SITE_MAP;

export async function generateMetadata({ 
    params 
}: { params: { id: OrderId, subscriptionId: PaymentSubscriptionId } }): Promise<Metadata> {
    const { id, subscriptionId } = params;

    return generatePageMetadata({
        title: '請求書兼領収書の印刷',
        description: '請求書兼領収書の印刷ページです。',
        url: `${SUBSCRIPTION_HISTORY_PATH}/${id}${PRINT_PATH}/${subscriptionId}`,
        robots: {
            index: false,
            follow: false,
        }
    });
}

const ReceiptPrintPage = ({
    params 
}: { params: { id: OrderId, subscriptionPaymentId: PaymentSubscriptionId }}) => {
    const { id, subscriptionPaymentId } = params;

    return (
        <ReceiptPrintLayout
            params={{ id }}
            isSubscription={true}
            subscriptionPaymentId={subscriptionPaymentId}
        />
    )
}

export default ReceiptPrintPage