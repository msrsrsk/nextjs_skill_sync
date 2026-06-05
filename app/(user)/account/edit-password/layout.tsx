import { Metadata } from "next"

import { generatePageMetadata } from "@/lib/metadata/page"
import { USER_METADATA } from "@/constants/metadata/user"

export const metadata: Metadata = generatePageMetadata({
    ...USER_METADATA.EDIT_PASSWORD
})

export default function EditPasswordLayout({
    children
}: { children: React.ReactNode }) {
    return <>
        {children}
    </>
}