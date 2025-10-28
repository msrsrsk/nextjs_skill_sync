import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    calculateReviewStats,
    calculateAverageRating
} from "@/services/review/calculation"
import { INITIAL_REVIEW_STAT_CONFIG } from "@/constants/index"

const { INITIAL_RATING, RATING_COUNTS } = INITIAL_REVIEW_STAT_CONFIG;

/* ==================================== 
    calculateReviewStats Test
==================================== */
describe('calculateReviewStats', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // データ無しの場合
    it('should return initial values when no reviews', () => {
        const result = calculateReviewStats([])
        
        expect(result.averageRating).toBe(INITIAL_RATING)
        expect(result.ratingCounts).toEqual(RATING_COUNTS)
    })

    // 単一レビューの場合
    it('should calculate stats for single review', () => {
        const reviews = [{ rating: 4 }]
        const result = calculateReviewStats(reviews)
        
        expect(result.averageRating).toBe(4)
        expect(result.ratingCounts).toEqual({
            1: 0,
            2: 0,
            3: 0,
            4: 1,
            5: 0
        })
    })

    // 複数レビューの場合
    it('should calculate stats for multiple reviews', () => {
        const reviews = [
            { rating: 5 },
            { rating: 4 },
            { rating: 3 },
            { rating: 5 },
            { rating: 2 }
        ]
        const result = calculateReviewStats(reviews)
        
        expect(result.averageRating).toBe(3.8)
        expect(result.ratingCounts).toEqual({
            1: 0,
            2: 1,
            3: 1,
            4: 1,
            5: 2
        })
    })

    // 全て同じ評価の場合
    it('should handle all same ratings', () => {
        const reviews = [
            { rating: 5 },
            { rating: 5 },
            { rating: 5 }
        ]
        const result = calculateReviewStats(reviews)
        
        expect(result.averageRating).toBe(5)
        expect(result.ratingCounts).toEqual({
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 3
        })
    })
})

/* ==================================== 
    calculateAverageRating Test
==================================== */
describe('calculateAverageRating', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 空の配列の場合
    it('should return initial rating when no reviews', () => {
        const result = calculateAverageRating([])
        
        expect(result).toBe(INITIAL_RATING)
    })

    // 単一レビューの場合
    it('should calculate average for single review', () => {
        const reviews = [{ rating: 4 } as Review]
        const result = calculateAverageRating(reviews)
        
        expect(result).toBe(4)
    })

    // 複数レビューの場合
    it('should calculate average for multiple reviews with rounding', () => {
        const reviews = [
            { rating: 5 } as Review,
            { rating: 4 } as Review,
            { rating: 3 } as Review,
            { rating: 2 } as Review
        ]
        const result = calculateAverageRating(reviews)
        
        expect(result).toBe(3.5)
    })

    // 全て同じ評価の場合
    it('should handle all same ratings', () => {
        const reviews = [
            { rating: 5 } as Review,
            { rating: 5 } as Review,
            { rating: 5 } as Review
        ]
        const result = calculateAverageRating(reviews)
        
        expect(result).toBe(5)
    })
})