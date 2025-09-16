import { Metadata } from "next"
import { Suspense } from "react"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import SearchWrapper from "@/components/layout/SearchWrapper"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import { generatePageMetadata } from "@/lib/metadata/page"
import { DEFAULT_PAGE } from "@/constants/index"
import { MAIN_METADATA } from "@/constants/metadata/main"

export const metadata: Metadata = generatePageMetadata({
    ...MAIN_METADATA.SEARCH
})

const SearchPage = async ({ 
    searchParams 
}: SearchParamsWithQuery) => {
    const page = parseInt(searchParams.page || DEFAULT_PAGE)
    const query = searchParams.query || ''
    
    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Search" 
                customClass="mt-6 mb-3 md:mt-10 md:mb-4" 
            />

            <Suspense fallback={<LoadingSpinner />}>
                <SearchWrapper 
                    page={page} 
                    query={query}
                />
            </Suspense>
        </div>
    </>
}

export default SearchPage