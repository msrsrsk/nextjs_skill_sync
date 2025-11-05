"use client"

import { Download } from "lucide-react"

import { EventButtonPrimary, LinkButtonPrimary } from "@/components/common/buttons/Button"
import { BUTTON_SIZES, BUTTON_TEXT_TYPES, SITE_MAP } from "@/constants/index"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { ORDER_HISTORY_PATH, PRINT_PATH, SUBSCRIPTION_HISTORY_PATH } = SITE_MAP;

interface ReceiptDownloadButtonProps {
    id: OrderId;
    showReceiptDownloadButton: boolean;
    isSubscription?: boolean;
}

const OrderReceiptDownloadButton = ({ 
    id, 
    showReceiptDownloadButton,
    isSubscription
}: ReceiptDownloadButtonProps) => {
    return (
        <div className="grid gap-1">
            <p className="text-sm leading-[28px] font-medium text-center">
                {isSubscription ? '請求書兼領収書' : '納品書兼領収書'}
            </p>
            {!isSubscription ? (
                <EventButtonPrimary
                    onClick={() => {
                        window.open(`${ORDER_HISTORY_PATH}/${id}${PRINT_PATH}`, '_blank');
                    }}
                    size={BUTTON_LARGE}
                    text={BUTTON_JA}
                    disabled={!showReceiptDownloadButton}
                >
                    詳細を見る
                    <Download className="w-[18px] h-[18px]" />
                </EventButtonPrimary>
            ) : (
                <LinkButtonPrimary
                    link={`${SUBSCRIPTION_HISTORY_PATH}/${id}`}
                    size={BUTTON_LARGE}
                    text={BUTTON_JA}
                >
                    ダウンロード
                    <Download className="w-[18px] h-[18px]" />
                </LinkButtonPrimary>
            )}
        </div>
    )
}

export default OrderReceiptDownloadButton