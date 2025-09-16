import { Suspense } from "react"

import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ReviewSectionContent from "@/components/ui/review/ReviewSectionContent"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import { getSectionReviews } from "@/lib/services/review/actions"

const ReviewSection = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ReviewSectionWrapper />
        </Suspense>
    )
}

const ReviewSectionWrapper = async () => {
    const result = await getSectionReviews();
        
    if (!result) {
        console.error('getSectionReviews returned null');
        return <ErrorMessage message="データの取得に失敗しました" />
    }
        
        const { data, error } = result;
    
    return <>
        <ReviewSectionContent 
            reviewData={data as ReviewResultProps} 
            hasError={error} 
        />
    </>
}

export default ReviewSection