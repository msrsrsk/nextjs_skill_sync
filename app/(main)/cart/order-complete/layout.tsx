import { Metadata } from "next"

import { generatePageMetadata } from "@/lib/metadata/page"
import { MAIN_METADATA } from "@/constants/metadata/main"

export const metadata: Metadata = generatePageMetadata({
    ...MAIN_METADATA.CART_ORDER_COMPLETE
})

export default function OrderCompleteLayout({
    children
}: { children: React.ReactNode }) {
    return <>
        {children}
    </>
}