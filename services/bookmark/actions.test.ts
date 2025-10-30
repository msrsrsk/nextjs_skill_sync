import { describe, it, expect, vi, beforeEach } from "vitest"

import {
    addBookmark,
    getUserBookmark,
    getUserAllBookmarks,
    removeBookmark,
    removeAllBookmarks
} from "@/services/bookmark/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BOOKMARK_ERROR } = ERROR_MESSAGES;
const { ADD_FAILED, REMOVE_FAILED, REMOVE_ALL_FAILED } = BOOKMARK_ERROR;

const mockCreateUserBookmark = vi.fn()
const mockGetUserProductBookmark = vi.fn()
const mockGetUserBookmarks = vi.fn()
const mockGetUserAllBookmarks = vi.fn()
const mockDeleteUserBookmark = vi.fn()
const mockDeleteUserAllBookmarks = vi.fn()

vi.mock('@/repository/bookmark', () => ({
    createUserBookmarkRepository: () => ({
        createUserBookmark: mockCreateUserBookmark
    }),
    getUserBookmarkRepository: () => ({
        getUserProductBookmark: mockGetUserProductBookmark,
        getUserBookmarks: mockGetUserBookmarks,
    }),
    deleteUserBookmarkRepository: () => ({
        deleteUserBookmark: mockDeleteUserBookmark,
        deleteUserAllBookmarks: mockDeleteUserAllBookmarks
    })
}))

/* ==================================== 
    Add Bookmark Test
==================================== */
describe('addBookmark', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should add bookmark successfully', async () => {
        mockCreateUserBookmark.mockResolvedValue(true)

        const result = await addBookmark({ 
            userId: 'user_test_123',
            productId: 'product_test_123'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.isBookmarked).toBe(true)
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateUserBookmark.mockResolvedValue(false)

        const result = await addBookmark({ 
            userId: '',
            productId: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(ADD_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockCreateUserBookmark.mockRejectedValue(new Error('Database error'))

        const result = await addBookmark({ 
            userId: 'user_test_123',
            productId: 'product_test_123'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(ADD_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Get User Product Bookmark Test
==================================== */
describe('getUserProductBookmark', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should get user product bookmark successfully', async () => {
        mockGetUserProductBookmark.mockResolvedValue(true)

        const result = await getUserBookmark({ 
            userId: 'user_test_123',
            productId: 'product_test_123'
        });

        expect(result.data).toBe(true)
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockGetUserProductBookmark.mockResolvedValue(false)

        const result = await getUserBookmark({ 
            userId: '',
            productId: ''
        })

        expect(result.data).toBe(false)
    })
})

/* ==================================== 
    Get User All Bookmarks Test
==================================== */
describe('getUserAllBookmarks', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should get user all bookmarks successfully', async () => {
        mockGetUserBookmarks.mockResolvedValue({
            userId: 'user_test_123',
            limit: 10,
        })

        const result = await getUserAllBookmarks({ 
            userId: 'user_test_123'
        })

        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockGetUserBookmarks.mockResolvedValue(false)

        const result = await getUserAllBookmarks({ 
            userId: ''
        })

        expect(result.data).toBe(false)
    })
})

/* ==================================== 
    Remove Bookmark Test
==================================== */
describe('removeBookmark', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should remove bookmark successfully', async () => {
        mockDeleteUserBookmark.mockResolvedValue(true)

        const result = await removeBookmark({ 
            userId: 'user_test_123',
            productId: 'product_test_123'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.isBookmarked).toBe(false)
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockDeleteUserBookmark.mockResolvedValue(false)

        const result = await removeBookmark({ 
            userId: '',
            productId: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(REMOVE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockDeleteUserBookmark.mockRejectedValue(new Error('Database error'))

        const result = await removeBookmark({ 
            userId: 'user_test_123',
            productId: 'product_test_123'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(REMOVE_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Remove All Bookmarks Test
==================================== */
describe('removeAllBookmarks', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should remove all bookmarks successfully', async () => {
        mockDeleteUserAllBookmarks.mockResolvedValue(true)

        const result = await removeAllBookmarks({ 
            userId: 'user_test_123'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockDeleteUserAllBookmarks.mockResolvedValue(false)

        const result = await removeAllBookmarks({ 
            userId: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(REMOVE_ALL_FAILED)
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockDeleteUserAllBookmarks.mockRejectedValue(new Error('Database error'))

        const result = await removeAllBookmarks({ 
            userId: 'user_test_123'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(REMOVE_ALL_FAILED)
    })
})