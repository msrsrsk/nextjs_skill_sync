import { Metadata } from "next"

import { generatePageMetadata } from "@/lib/metadata/page"
import { USER_METADATA } from "@/constants/metadata/user"

export const metadata: Metadata = generatePageMetadata({
    ...USER_METADATA.DELETE_ACCOUNT_PRIVATE
})

export default function DeleteAccountLayout({
    children
}: { children: React.ReactNode }) {
    return <>
        {children}
    </>
}