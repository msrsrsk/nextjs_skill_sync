import { describe, it, expect, vi, beforeEach } from "vitest"

import { createReviewAction } from "@/services/review/form-actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { REVIEW_ERROR, AUTH_ERROR, CLOUDFLARE_ERROR } = ERROR_MESSAGES;

const { CREATE_FAILED, POST_MISSING_DATA, POST_FAILED } = REVIEW_ERROR;
const { SESSION_NOT_FOUND } = AUTH_ERROR;
const { R2_UPLOAD_FAILED } = CLOUDFLARE_ERROR;

vi.mock('@/lib/middleware/auth', () => ({
    actionAuth: vi.fn()
}))

vi.mock('@/services/review/actions', () => ({
    createReview: vi.fn()
}))

vi.mock('@/services/cloudflare/actions', () => ({
    uploadImageToR2: vi.fn()
}))

const getMockActionAuth = async () => {
    const { actionAuth } = await import('@/lib/middleware/auth')
    return vi.mocked(actionAuth)
}

const getMockCreateReview = async () => {
    const { createReview } = await import('@/services/review/actions')
    return vi.mocked(createReview)
}

const getMockUploadImageToR2 = async () => {
    const { uploadImageToR2 } = await import('@/services/cloudflare/actions')
    return vi.mocked(uploadImageToR2)
}

/* ==================================== 
    createReviewAction Test
==================================== */
describe('createReviewAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const prevState = {
        success: false,
        error: null,
        timestamp: 0
    }

    const createMockFormData = (includeFiles = false, includeProductId = true) => {
        const formData = new FormData()
        formData.set('rating', '5')
        formData.set('name', 'test-name')
        formData.set('comment', 'test-comment')
        
        if (includeFiles) {
            const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
            formData.append('files', mockFile)
        }

        if (includeProductId) {
            formData.set('productId', 'test-product-id')
        }
        
        return formData
    }
    
    const mockFormData = createMockFormData(false, true)
    const mockFormDataWithFiles = createMockFormData(true, true)
    const mockFormDataWithoutProductId = createMockFormData(false, false)

    // 作成成功（画像なし）
    it('should create review successfully without images', async () => {
        const actionAuth = await getMockActionAuth()
        const mockCreateReview = await getMockCreateReview()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockCreateReview.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await createReviewAction(prevState, mockFormData)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 作成成功（画像あり）
    it('should create review successfully with images', async () => {
        const actionAuth = await getMockActionAuth()
        const mockCreateReview = await getMockCreateReview()
        const mockUploadImageToR2 = await getMockUploadImageToR2()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockUploadImageToR2.mockResolvedValue({
            success: true,
            error: null,
            data: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
        })

        mockCreateReview.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await createReviewAction(prevState, mockFormDataWithFiles)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（認証失敗）
    it('should create review failed with authentication error', async () => {
        const actionAuth = await getMockActionAuth()
        const mockCreateReview = await getMockCreateReview()

        actionAuth.mockResolvedValue({
            success: false,
            error: SESSION_NOT_FOUND,
        })

        mockCreateReview.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await createReviewAction(prevState, mockFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(SESSION_NOT_FOUND)
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（画像アップロード失敗）
    it('should create review failed with image upload error', async () => {
        const actionAuth = await getMockActionAuth()
        const mockCreateReview = await getMockCreateReview()
        const mockUploadImageToR2 = await getMockUploadImageToR2()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockUploadImageToR2.mockResolvedValue({
            success: false,
            error: R2_UPLOAD_FAILED,
            data: null
        })

        mockCreateReview.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await createReviewAction(prevState, mockFormDataWithFiles)

        expect(result.success).toBe(false)
        expect(result.error).toBe(R2_UPLOAD_FAILED)
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（productId が null ）
    it('should create review failed with productId is null', async () => {
        const actionAuth = await getMockActionAuth()
        const mockCreateReview = await getMockCreateReview()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockCreateReview.mockResolvedValue({
            success: true,
            error: null
        })

        const result = await createReviewAction(prevState, mockFormDataWithoutProductId)

        expect(result.success).toBe(false)
        expect(result.error).toBe(POST_MISSING_DATA)
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（FormData が空）
    it('should create review failed with formData is empty', async () => {
        const emptyFormData = new FormData()

        const actionAuth = await getMockActionAuth()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        const result = await createReviewAction(prevState, emptyFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(POST_MISSING_DATA)
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（レビューの作成失敗）
    it('should create review failed with review creation error', async () => {
        const actionAuth = await getMockActionAuth()
        const mockCreateReview = await getMockCreateReview()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockCreateReview.mockResolvedValue({
            success: false,
            error: CREATE_FAILED
        })

        const result = await createReviewAction(prevState, mockFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（認証の例外発生）
    it('should handle unexpected errors in catch block', async () => {
        const actionAuth = await getMockActionAuth()
        actionAuth.mockRejectedValue(new Error('Unexpected error'))
    
        const result = await createReviewAction(prevState, mockFormData)
    
        expect(result.success).toBe(false)
        expect(result.error).toBe('Unexpected error')
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（レビューの作成の例外発生）
    it('should create review failed with review creation exception', async () => {
        const actionAuth = await getMockActionAuth()
        const mockCreateReview = await getMockCreateReview()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockCreateReview.mockRejectedValue(
            new Error('Database error')
        )

        const result = await createReviewAction(prevState, mockFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗（REVIEW_ERROR.POST_FAILED が発生する例外）
    it('should return REVIEW_ERROR.POST_FAILED when non-Error exception occurs', async () => {
        const actionAuth = await getMockActionAuth()
        const mockCreateReview = await getMockCreateReview()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockCreateReview.mockRejectedValue('String error message')

        const result = await createReviewAction(prevState, mockFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(POST_FAILED)
        expect(result.timestamp).toBeDefined()
    })
})