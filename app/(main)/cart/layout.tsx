import { Metadata } from "next"

import { generatePageMetadata } from "@/lib/metadata/page"
import { MAIN_METADATA } from "@/constants/metadata/main"

export const metadata: Metadata = generatePageMetadata({
    ...MAIN_METADATA.CART
})

export default function CartLayout({
    children
}: { children: React.ReactNode }) {
    return <>
        {children}
    </>
}