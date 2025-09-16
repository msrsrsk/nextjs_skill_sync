import { Metadata } from "next"

import { generatePageMetadata } from "@/lib/metadata/page"
import { ACCOUNT_METADATA } from "@/constants/metadata/auth"

export const metadata: Metadata = generatePageMetadata({
    ...ACCOUNT_METADATA.RESET_PASSWORD
})

export default function ResetPasswordLayout({
    children
}: { children: React.ReactNode }) {
    return <>
        {children}
    </>
}