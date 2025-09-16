import { Metadata } from "next"
import { Suspense } from "react"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import ReviewListPageWrapper from "@/components/layout/ReviewListPageWrapper"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import { generatePageMetadata } from "@/lib/metadata/page"
import { DEFAULT_PAGE } from "@/constants/index"
import { MAIN_METADATA } from "@/constants/metadata/main"

export const dynamic = "force-dynamic"

export const metadata: Metadata = generatePageMetadata({
    ...MAIN_METADATA.PUBLIC_REVIEW
})

const PublicReviewListPage = ({ 
    searchParams 
}: SearchParamsWithQuery) => {
    const page = parseInt(searchParams.page || DEFAULT_PAGE)
    const query = searchParams.query || ''

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Review" 
                customClass="mt-6 mb-2 md:mt-10 md:mb-4" 
            />

            <Suspense fallback={<LoadingSpinner />}>
                <ReviewListPageWrapper 
                    page={page} 
                    query={query}
                    isPrivate={false}
                />
            </Suspense>
        </div>
    </>
}

export default PublicReviewListPage