import { Suspense } from "react"
import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import ReviewListPageWrapper from "@/components/layout/ReviewListPageWrapper"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import { generatePageMetadata } from "@/lib/metadata/page"
import { DEFAULT_PAGE } from "@/constants/index"
import { USER_METADATA } from "@/constants/metadata/user"

export const metadata: Metadata = generatePageMetadata({
    ...USER_METADATA.REVIEW_HISTORY
})

const PrivateReviewListPage = ({ 
    searchParams 
}: SearchParamsProps) => {
    const page = parseInt(searchParams.page || DEFAULT_PAGE)

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Review History" 
                customClass="mt-6 mb-2 md:mt-10 md:mb-[56px]" 
            />

            <Suspense fallback={<LoadingSpinner />}>
                <ReviewListPageWrapper 
                    page={page}
                    isPrivate={true}
                />
            </Suspense>
        </div>
    </>
}

export default PrivateReviewListPage