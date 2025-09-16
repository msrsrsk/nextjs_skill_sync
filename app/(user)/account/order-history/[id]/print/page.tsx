import { Metadata } from "next"

import ReceiptPrintLayout from "@/components/ui/order/ReceiptPrintLayout"
import { generatePageMetadata } from "@/lib/metadata/page"
import { SITE_MAP } from "@/constants/index"

const { ORDER_HISTORY_PATH, PRINT_PATH } = SITE_MAP;

export async function generateMetadata({ 
    params 
}: { params: { id: OrderId } }): Promise<Metadata> {
    const { id } = params;

    return generatePageMetadata({
        title: '納品書兼領収書の印刷',
        description: '納品書兼領収書の印刷ページです。',
        url: `${ORDER_HISTORY_PATH}/${id}${PRINT_PATH}`,
        robots: {
            index: false,
            follow: false,
        }
    });
}

const ReceiptPrintPage = ({ params }: { params: { id: OrderId }}) => {
    const { id } = params;

    return (
        <ReceiptPrintLayout params={{ id }} />
    )
}

export default ReceiptPrintPage