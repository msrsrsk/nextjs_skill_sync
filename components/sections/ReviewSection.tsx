import { Suspense } from "react"

import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ReviewSectionContent from "@/components/ui/review/ReviewSectionContent"
import { getSectionReviews } from "@/lib/services/review/actions"

const ReviewSection = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ReviewSectionWrapper />
        </Suspense>
    )
}

const ReviewSectionWrapper = async () => {
    const { data, error } = await getSectionReviews();
    
    return <>
        <ReviewSectionContent 
            reviewData={data as ReviewResultProps} 
            hasError={error} 
        />
    </>
}

export default ReviewSection