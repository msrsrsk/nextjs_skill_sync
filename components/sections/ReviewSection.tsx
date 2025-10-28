import { Suspense } from "react"

import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ReviewSectionContent from "@/components/ui/review/ReviewSectionContent"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import { getSectionReviews } from "@/services/review/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { REVIEW_ERROR } = ERROR_MESSAGES;

const ReviewSection = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ReviewSectionWrapper />
        </Suspense>
    )
}

const ReviewSectionWrapper = async () => {
    const result = await getSectionReviews();
        
    if (!result.success || !result.data) {
        console.error('getSectionReviews returned null');
        return <ErrorMessage message="データの取得に失敗しました" />
    }
        
    const { data } = result;
    
    return <>
        <ReviewSectionContent 
            reviewData={data as ReviewResultProps} 
            hasError={REVIEW_ERROR.FETCH_FAILED || null} 
        />
    </>
}

export default ReviewSection