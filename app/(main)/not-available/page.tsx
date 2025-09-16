import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import { generatePageMetadata } from "@/lib/metadata/page"
import { MAIN_METADATA } from "@/constants/metadata/main"

export const metadata: Metadata = generatePageMetadata({
    ...MAIN_METADATA.NOT_AVAILABLE
})

const NotAvailablePage = () => {
    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <div className="mt-6 mb-8 md:my-10 relative flex justify-center">
                <PageTitle title="Not Available" />
            </div>

            <div className="max-w-xl mx-auto">
                <p className="attention-text text-center font-poppins">
                    We appreciate your visit !<br />
                    However, our service is currently not available in your country.<br />
                    We&apos;re sorry for the inconvenience and hope to welcome you soon.<br />
                </p>
            </div>
        </div>
    </>
}

export default NotAvailablePage