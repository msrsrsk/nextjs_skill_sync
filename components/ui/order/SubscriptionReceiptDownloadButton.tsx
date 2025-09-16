"use client"

import { Download } from "lucide-react"

import { BUTTON_TYPES, SITE_MAP } from "@/constants/index"

const { BUTTON_TYPE } = BUTTON_TYPES;
const { SUBSCRIPTION_HISTORY_PATH, PRINT_PATH } = SITE_MAP;

interface ReceiptDownloadButtonProps {
    orderId: OrderId;
    subscriptionPaymentId: PaymentSubscriptionId;
}

const SubscriptionReceiptDownloadButton = ({ 
    orderId, 
    subscriptionPaymentId
}: ReceiptDownloadButtonProps) => {
    return (
        <div className="grid gap-1">
            <button 
                onClick={() => {
                    window.open(`${SUBSCRIPTION_HISTORY_PATH}/${orderId}${PRINT_PATH}/${subscriptionPaymentId}`, '_blank');
                }}
                type={BUTTON_TYPE as ButtonType}
                className="text-sm leading-5 font-medium text-tag-extras flex items-center gap-1 border-b border-tag-extras w-fit pb-[2px]"
            >
                請求書兼領収書
                <Download 
                    className="w-[17px] h-[17px] text-tag-extras pb-[1px]" 
                    strokeWidth={1.5} 
                />
            </button>
        </div>
    )
}

export default SubscriptionReceiptDownloadButton