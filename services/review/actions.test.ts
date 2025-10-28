import { describe, it, expect, vi, beforeEach } from "vitest"

import {
    createReview, 
    getSectionReviews,
    getProductReviews
} from "@/services/review/actions"
import { mockReview } from "@/__tests__/mocks/domain-mocks"

const mockCreateReview = vi.fn()
const mockGetAllReviews = vi.fn() 
const mockGetProductReviews = vi.fn()

vi.mock('@/repository/review', () => ({
    createReviewRepository: () => ({
        createReview: mockCreateReview
    }),
    getReviewRepository: () => ({
        getAllReviews: mockGetAllReviews,
        getProductReviews: mockGetProductReviews
    })
}))

/* ==================================== 
    Create Review Test
==================================== */
describe('createReview', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create review successfully', async () => {
        mockCreateReview.mockResolvedValue(true)

        const result = await createReview({
            reviewData: mockReview as Review
        })

        expect(result.success).toBe(true)
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateReview.mockResolvedValue(false)

        const result = await createReview({
            reviewData: mockReview as Review
        })

        expect(result.success).toBe(false)
    })
})

/* ==================================== 
    Get Section Reviews Test
==================================== */
describe('getSectionReviews', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should get section reviews successfully', async () => {
        mockGetAllReviews.mockResolvedValue({
            reviews: [mockReview],
            totalCount: 1
        })

        const result = await getSectionReviews()

        expect(result.success).toBe(true)
        expect(result.data).toEqual({
            reviews: [mockReview],
            totalCount: 1
        })
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockGetAllReviews.mockResolvedValue({
            reviews: null,
            totalCount: null
        })

        const result = await getSectionReviews()

        expect(result.success).toBe(false)
        expect(result.data).toEqual({
            reviews: null,
            totalCount: null
        })
    })
})

/* ==================================== 
    Get Product Reviews Test
==================================== */
describe('getProductReviews', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should get product reviews successfully', async () => {
        mockGetProductReviews.mockResolvedValue({
            reviews: [mockReview],
            totalCount: 1
        })

        const result = await getProductReviews({
            productSlug: 'test-product-slug'
        })

        expect(result.success).toBe(true)
        expect(result.data).toEqual({
            reviews: [mockReview],
            totalCount: 1
        })
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockGetProductReviews.mockResolvedValue({
            reviews: null,
            totalCount: null
        })

        const result = await getProductReviews({
            productSlug: 'test-product-slug'
        })

        expect(result.success).toBe(false)
        expect(result.data).toEqual({
            reviews: null,
            totalCount: null
        })
    })
})
