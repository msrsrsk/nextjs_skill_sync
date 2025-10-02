import { INITIAL_REVIEW_STAT_CONFIG } from "@/constants/index"

const { 
    INITIAL_RATING, 
    RATING_COUNTS,
    ROUNDING_FACTOR,
} = INITIAL_REVIEW_STAT_CONFIG;

export const calculateReviewStats = (
    reviews: { rating: ReviewRating }[] 
): ReviewStatsProps => {
    if (reviews.length === 0) {
        return {
            averageRating: INITIAL_RATING,
            ratingCounts: RATING_COUNTS
        };
    }

    const ratingCounts = RATING_COUNTS;
    
    reviews.forEach(review => {
        ratingCounts[review.rating as keyof typeof ratingCounts]++;
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
        averageRating,
        ratingCounts
    }
}

export const calculateAverageRating = (
    reviews: Review[]
): number => {
    if (reviews.length === 0) return INITIAL_RATING;
    const average = reviews
        .reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    return Math.round(average * ROUNDING_FACTOR) / ROUNDING_FACTOR;
}