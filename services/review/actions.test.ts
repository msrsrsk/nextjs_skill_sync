import { describe, it, expect, vi, beforeEach } from "vitest"

import {
    createReview, 
    getSectionReviews,
    getProductReviews
} from "@/services/review/actions"
import { mockReview } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { REVIEW_ERROR } = ERROR_MESSAGES;

const { CREATE_FAILED, INDIVIDUAL_FETCH_FAILED, FETCH_FAILED } = REVIEW_ERROR;

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
        expect(result.error).toBeNull()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateReview.mockResolvedValue(false)

        const result = await createReview({
            reviewData: null as unknown as Review
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
    })

    // 作成失敗(例外発生)
    it('should return failure when exception occurs', async () => {
        mockCreateReview.mockRejectedValue(new Error('Database error'))

        const result = await createReview({
            reviewData: null as unknown as Review
        })
        
        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
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

    // 作成失敗（reviews が null）
    it('should return failure when reviews is null', async () => {
        mockGetAllReviews.mockResolvedValue({
            reviews: null,
            totalCount: 0
        })

        const result = await getSectionReviews()

        expect(result.success).toBe(false)
        expect(result.error).toEqual(FETCH_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（totalCount が null）
    it('should return failure when totalCount is null', async () => {
        mockGetAllReviews.mockResolvedValue({
            reviews: [mockReview],
            totalCount: null
        })

        const result = await getSectionReviews()

        expect(result.success).toBe(false)
        expect(result.error).toEqual(FETCH_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（データが全て null）
    it('should return failure when data is all null', async () => {
        mockGetAllReviews.mockResolvedValue({
            reviews: null,
            totalCount: null
        })

        const result = await getSectionReviews()

        expect(result.success).toBe(false)
        expect(result.error).toEqual(FETCH_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockGetAllReviews.mockRejectedValue(new Error('Database error'))

        const result = await getSectionReviews()

        expect(result.success).toBe(false)
        expect(result.error).toEqual(FETCH_FAILED)
        expect(result.data).toBeNull()
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

    // 作成失敗（reviews が null）
    it('should return failure when reviews is null', async () => {
        mockGetProductReviews.mockResolvedValue({
            reviews: null,
            totalCount: 0
        })

        const result = await getProductReviews({
            productSlug: 'test-product-slug'
        })

        expect(result.success).toBe(false)
        expect(result.error).toEqual(INDIVIDUAL_FETCH_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（totalCount が null）
    it('should return failure when totalCount is null', async () => {
        mockGetProductReviews.mockResolvedValue({
            reviews: [mockReview],
            totalCount: null
        })

        const result = await getProductReviews({
            productSlug: 'test-product-slug'
        })

        expect(result.success).toBe(false)
        expect(result.error).toEqual(INDIVIDUAL_FETCH_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（データが全て null）
    it('should return failure when data is all null', async () => {
        mockGetProductReviews.mockResolvedValue({
            reviews: null,
            totalCount: null
        })

        const result = await getProductReviews({
            productSlug: 'test-product-slug'
        })

        expect(result.success).toBe(false)
        expect(result.error).toEqual(INDIVIDUAL_FETCH_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockGetProductReviews.mockRejectedValue(new Error('Database error'))

        const result = await getProductReviews({
            productSlug: 'test-product-slug'
        })
        
        expect(result.success).toBe(false)
        expect(result.error).toEqual(INDIVIDUAL_FETCH_FAILED)
        expect(result.data).toBeNull()
    })
})
