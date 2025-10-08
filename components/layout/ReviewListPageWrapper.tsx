import ReviewListWrapper from "@/components/layout/ReviewListWrapper"
import Pagination from "@/components/ui/navigation/Pagination"
import SearchForm from "@/components/common/forms/SearchForm"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import NoDataText from "@/components/common/display/NoDataText"
import { requireUser } from "@/lib/middleware/auth"
import { getReviewRepository } from "@/repository/review"
import { REVIEW_DISPLAY_CONFIG, PAGINATION_CONFIG } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PAGE_LIMIT } = REVIEW_DISPLAY_CONFIG;
const { INITIAL_PAGE } = PAGINATION_CONFIG;
const { REVIEW_ERROR } = ERROR_MESSAGES;

interface ReviewListPageWrapperProps {
    page: number;
    query?: string;
    isPrivate?: boolean;
}

const ReviewListPageWrapper = async ({ 
    page, 
    query = '', 
    isPrivate = false
}: ReviewListPageWrapperProps) => {
    const limit = PAGE_LIMIT;

    let userId: UserId | undefined;
    
    if (isPrivate) {
        const { userId: privateUserId } = await requireUser();
        userId = privateUserId;
    }

    const repository = getReviewRepository();

    const { data } = isPrivate 
        ? await repository.getPaginatedReviews({ page, limit, userId })
        : await repository.getPaginatedReviews({ page, limit, query });
    // const { data } = { data: undefined };

    if (!data) return <ErrorMessage message={REVIEW_ERROR.FETCH_FAILED} />

    const { 
        reviews, 
        totalPages, 
        currentPage, 
        hasNextPage, 
        hasPrevPage 
    } = data;

    return <>
        {!isPrivate && (
            <div className="max-w-[400px] mx-auto mb-10 md:mb-[56px]">
                <SearchForm 
                    query={query} 
                    action="/review"
                />
            </div>
        )}

        {reviews.length === 0 ? (
            <NoDataText />
        ) : (
            <div className="max-w-4xl mx-auto">
                <ReviewListWrapper reviews={reviews as ReviewWithUserAndProduct[]} />

                {totalPages > INITIAL_PAGE && (
                    <Pagination 
                        totalPages={totalPages}
                        currentPage={currentPage}
                        hasNextPage={hasNextPage}
                        hasPrevPage={hasPrevPage}
                    />
                )}
            </div>
        )}
    </>
}

export default ReviewListPageWrapper