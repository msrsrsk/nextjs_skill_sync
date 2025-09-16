"use client"

import SubscriptionReceiptDownloadButton from "@/components/ui/order/SubscriptionReceiptDownloadButton"
import useIsMobile from "@/hooks/layout/useIsMobile"
import useSubscriptionPaymentDisplay from "@/hooks/subscription/useSubscriptionPaymentDisplay"
import { CheckIcon } from "@/components/common/icons/SvgIcons"
import { formatDate } from "@/lib/utils/format"
import { SUBSCRIPTION_PAYMENT_DISPLAY, SUBSCRIPTION_PAYMENT_STATUS } from "@/constants/index"

const { DESKTOP_MAX_ITEMS, MOBILE_MAX_ITEMS } = SUBSCRIPTION_PAYMENT_DISPLAY;
const { SUCCEEDED } = SUBSCRIPTION_PAYMENT_STATUS;

interface SubscriptionContractHistoryProps {
    order_items: OrderItem[];
    orderId: OrderId;
}

const SubscriptionContractHistory = ({
    order_items,
    orderId
}: SubscriptionContractHistoryProps) => {

    const isMobile = useIsMobile();

    const subscriptionPayments = order_items[0].subscriptionPayments;
    const maxItems = isMobile ? MOBILE_MAX_ITEMS : DESKTOP_MAX_ITEMS;
    const shouldShowOmit = subscriptionPayments.length > maxItems;

    const { 
        getDisplayData,
        getCheckIconColor, 
        getPaymentSubtext 
    } = useSubscriptionPaymentDisplay({
        subscriptionPayments,
        maxItems
    });

    const displayData = getDisplayData();

    return (
        <div className="relative bg-form-bg rounded-[20px] lg:max-w-[440px] w-full py-5 px-6 grid gap-3">
            <p className="text-sm leading-[30px] font-bold md:text-base">
                契約履歴
            </p>
            <div className="grid gap-[10px]">
                {displayData
                    .map(({ 
                        payment: subscriptionPayment, 
                        originalIndex 
                    }, index) => (
                    <div 
                        key={subscriptionPayment.id}
                        className={`sub-history-list${
                            shouldShowOmit && index === 0 ? ' is-omit' : ''
                        }`}
                    >
                        <CheckIcon 
                            customClass="sub-history-icon" 
                            color={getCheckIconColor(originalIndex)}
                        />
                        <div>
                            <div className="flex items-baseline">
                                <p className="text-base leading-7 font-medium font-poppins">
                                    {formatDate(subscriptionPayment.payment_date)}
                                </p>
                                {getPaymentSubtext(originalIndex) && (
                                    <p className="text-sm leading-5 font-medium">
                                        （{getPaymentSubtext(originalIndex)}）
                                    </p>
                                )}
                            </div>
                            {subscriptionPayments[originalIndex].status === SUCCEEDED && (
                                <SubscriptionReceiptDownloadButton 
                                    orderId={orderId} 
                                    subscriptionPaymentId={subscriptionPayment.id}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SubscriptionContractHistory