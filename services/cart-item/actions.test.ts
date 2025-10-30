import { describe, it, expect, vi, beforeEach } from "vitest"

import {
    createCartItems,
    updateCartItemQuantity,
    getCartItems,
    getCartItemByProduct,
    deleteCartItems,
    deleteAllCartItems
} from "@/services/cart-item/actions"
import { mockCartItems } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CART_ITEM_ERROR } = ERROR_MESSAGES;
const { CREATE_FAILED, UPDATE_QUANTITY_FAILED, DELETE_FAILED, DELETE_ALL_FAILED } = CART_ITEM_ERROR;

const mockCreateCartItems = vi.fn()
const mockUpdateCartItemQuantity = vi.fn()
const mockGetCartItems = vi.fn()
const mockGetCartItemByProduct = vi.fn()
const mockDeleteCartItems = vi.fn()
const mockDeleteAllCartItems = vi.fn()

vi.mock('@/repository/cartItem', () => ({
    createCartItemRepository: () => ({
        createCartItems: mockCreateCartItems
    }),
    updateCartItemRepository: () => ({
        updateCartItemQuantity: mockUpdateCartItemQuantity
    }),
    getCartItemRepository: () => ({
        getCartItems: mockGetCartItems,
        getCartItemByProductId: mockGetCartItemByProduct,
    }),
    deleteCartItemRepository: () => ({
        deleteCartItem: mockDeleteCartItems,
        deleteAllCartItems: mockDeleteAllCartItems,
    })
}))

/* ==================================== 
    Create Cart Items Test
==================================== */
describe('createCartItems', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create cart items successfully', async () => {
        mockCreateCartItems.mockResolvedValue(mockCartItems)

        const result = await createCartItems({ 
            cartItemsData: mockCartItems[0]
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateCartItems.mockResolvedValue(null)

        const result = await createCartItems({ 
            cartItemsData: mockCartItems[0]
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockCreateCartItems.mockRejectedValue(new Error('Database error'))

        const result = await createCartItems({ 
            cartItemsData: mockCartItems[0]
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Update Cart Item Quantity Test
==================================== */
describe('updateCartItemQuantity', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    const mockCartItem = {
        userId: mockCartItems[0].user_id,
        productId: mockCartItems[0].product_id,
        quantity: mockCartItems[0].quantity
    }

    // 作成成功
    it('should update cart item quantity successfully', async () => {
        mockUpdateCartItemQuantity.mockResolvedValue(mockCartItems)

        const result = await updateCartItemQuantity(mockCartItem)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockUpdateCartItemQuantity.mockResolvedValue(null)

        const result = await updateCartItemQuantity(mockCartItem)

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_QUANTITY_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockUpdateCartItemQuantity.mockRejectedValue(new Error('Database error'))

        const result = await updateCartItemQuantity(mockCartItem)

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_QUANTITY_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Get Cart Items Test
==================================== */
describe('getCartItems', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should get cart items successfully', async () => {
        mockGetCartItems.mockResolvedValue(mockCartItems)

        const result = await getCartItems({ 
            userId: mockCartItems[0].user_id
        })

        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockGetCartItems.mockResolvedValue(null)

        const result = await getCartItems({ 
            userId: mockCartItems[0].user_id
        })

        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Get Cart Item By Product Test
==================================== */
describe('getCartItemByProduct', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    const mockCartItem = {
        userId: mockCartItems[0].user_id,
        productId: mockCartItems[0].product_id
    }

    // 作成成功
    it('should get cart item by product successfully', async () => {
        mockGetCartItemByProduct.mockResolvedValue(mockCartItems)

        const result = await getCartItemByProduct(mockCartItem)

        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockGetCartItemByProduct.mockResolvedValue(null)

        const result = await getCartItemByProduct(mockCartItem)

        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Delete Cart Items Test
==================================== */
describe('deleteCartItems', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    const mockCartItem = {
        userId: mockCartItems[0].user_id,
        productId: mockCartItems[0].product_id
    }

    // 作成成功
    it('should delete cart items successfully', async () => {
        mockDeleteCartItems.mockResolvedValue(true)

        const result = await deleteCartItems(mockCartItem)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockDeleteCartItems.mockResolvedValue(false)

        const result = await deleteCartItems(mockCartItem)

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockDeleteCartItems.mockRejectedValue(new Error('Database error'))

        const result = await deleteCartItems(mockCartItem)

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Delete All Cart Items Test
==================================== */
describe('deleteAllCartItems', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should delete cart items successfully', async () => {
        mockDeleteAllCartItems.mockResolvedValue(true)

        const result = await deleteAllCartItems({ userId: mockCartItems[0].user_id })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockDeleteAllCartItems.mockResolvedValue(false)

        const result = await deleteAllCartItems({ userId: mockCartItems[0].user_id })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_ALL_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockDeleteAllCartItems.mockRejectedValue(new Error('Database error'))

        const result = await deleteAllCartItems({ userId: mockCartItems[0].user_id })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_ALL_FAILED)
        expect(result.data).toBeNull()
    })
})