import { Metadata } from "next"

import { generatePageMetadata } from "@/lib/metadata/page"
import { ACCOUNT_METADATA } from "@/constants/metadata/auth"

export const metadata: Metadata = generatePageMetadata({
    ...ACCOUNT_METADATA.LOGIN
})

export default function LoginLayout({
    children
}: { children: React.ReactNode }) {
    return <>
        {children}
    </>
}