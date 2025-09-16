import { convertToJST } from "@/lib/utils/format"
import { 
    INITIAL_REVIEW_STAT_CONFIG, 
    PRICE_SLIDER_CONFIG,
    DISCOUNT_PERCENTAGE_MULTIPLIER,
} from "@/constants/index"

const { 
    INITIAL_RATING, 
    RATING_COUNTS,
    ROUNDING_FACTOR,
} = INITIAL_REVIEW_STAT_CONFIG;

const { STEP_BY_PRICE_RANGE } = PRICE_SLIDER_CONFIG;

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
    };
};

export const calculateAverageRating = (
    reviews: Review[]
): number => {
    if (reviews.length === 0) return INITIAL_RATING;
    const average = reviews
        .reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    return Math.round(average * ROUNDING_FACTOR) / ROUNDING_FACTOR;
};

export const getStepByPriceRange = (
    price: number
): number => {
    if (price < STEP_BY_PRICE_RANGE.THRESHOLD_1) return STEP_BY_PRICE_RANGE.STEP_1;
    if (price < STEP_BY_PRICE_RANGE.THRESHOLD_2) return STEP_BY_PRICE_RANGE.STEP_2;
    if (price < STEP_BY_PRICE_RANGE.THRESHOLD_3) return STEP_BY_PRICE_RANGE.STEP_3;
    if (price < STEP_BY_PRICE_RANGE.THRESHOLD_4) return STEP_BY_PRICE_RANGE.STEP_4;
    return STEP_BY_PRICE_RANGE.STEP_5;
};

export const getDiscountRate = (
    regularPrice: number, 
    targetPrice: number
): number => {
    if (regularPrice <= targetPrice) return 0;
    
    const discountAmount = regularPrice - targetPrice;
    const discountRate = Math.round(
        (discountAmount / regularPrice) * DISCOUNT_PERCENTAGE_MULTIPLIER
    );
    
    return discountRate;
};

export const isWithinThreshold = (
    createdAt: OrderCreatedAt,
    cancelThreshold: number
): boolean => {
    const convertedCreatedAt = convertToJST(createdAt);
    const createdDate = new Date(convertedCreatedAt);

    const currentDate = new Date();

    const threeMonthsAgo = new Date(currentDate);
    threeMonthsAgo.setMonth(currentDate.getMonth() - cancelThreshold);

    return createdDate > threeMonthsAgo;
}