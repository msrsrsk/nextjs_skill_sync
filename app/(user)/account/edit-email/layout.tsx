import { Metadata } from "next"

import { generatePageMetadata } from "@/lib/metadata/page"
import { USER_METADATA } from "@/constants/metadata/user"

export const metadata: Metadata = generatePageMetadata({
    ...USER_METADATA.EDIT_EMAIL
})

export default function EditEmailLayout({
    children
}: { children: React.ReactNode }) {
    return <>
        {children}
    </>
}