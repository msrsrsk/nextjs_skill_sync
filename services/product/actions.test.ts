import { describe, it, expect, vi, beforeEach } from "vitest"
import prisma from "@/lib/clients/prisma/client"

import {
    getProductBySlug,
    getProductByProductId,
    getProductsByIds,
    getAllCategoriesProductsSalesVolume,
    getPaginatedProducts,
    updateStockAndSoldCount
} from "@/services/product/actions"
import { updateProductRepository } from "@/repository/product"
import { updateProductSaleRepository } from "@/repository/productSale"
import { mockProduct, mockPaginatedProducts } from "@/__tests__/mocks/domain-mocks"
import { 
    PRODUCTS_DISPLAY_CONFIG, 
    GET_PRODUCTS_PAGE_TYPES,
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { OPTIMAL_SYNCS_LIMIT } = PRODUCTS_DISPLAY_CONFIG;
const { SYNC_CONDITIONS } = GET_PRODUCTS_PAGE_TYPES;
const { PRODUCT_ERROR } = ERROR_MESSAGES;
const { NOT_FOUND, FETCH_FAILED, UPDATE_STOCK_AND_SOLD_COUNT_FAILED } = PRODUCT_ERROR;

const mockGetProductBySlug = vi.fn()
const mockGetProductByProductId = vi.fn()
const mockGetProductsByIds = vi.fn()
const mockGetAllCategoriesProducts = vi.fn()
const mockGetPaginatedProducts = vi.fn()

vi.mock('@/lib/clients/prisma/client', () => ({
    default: {
        $transaction: vi.fn()
    }
}))

vi.mock('@/repository/product', () => ({
    getProductRepository: () => ({
        getProductBySlug: mockGetProductBySlug,
        getProductByProductId: mockGetProductByProductId,
        getProductsByIds: mockGetProductsByIds,
        getAllCategoriesProducts: mockGetAllCategoriesProducts,
        getPaginatedProducts: mockGetPaginatedProducts,
    }),
    updateProductRepository: vi.fn()
}))

vi.mock('@/repository/productSale', () => ({
    updateProductSaleRepository: vi.fn()
}))

/* ==================================== 
    Get Product By Slug Test
==================================== */
describe('getProductBySlug', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功（商品データ有り）
    it('should return product data successfully', async () => {
        mockGetProductBySlug.mockResolvedValue(mockProduct)

        const result = await getProductBySlug({ slug: 'test-product' })

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
    })

    // 取得成功（関連商品有り）
    it('should return product data with optimal syncs successfully', async () => {
        const mockProductWithOptimalSyncs = {
            ...mockProduct,
            product_relations: {
                optimal_syncs_required_id: 'id1,id2,id3',
                optimal_syncs_option_id: null,
                optimal_syncs_recommended_id: null
            }
        }
        mockGetProductBySlug.mockResolvedValue(mockProductWithOptimalSyncs)

        const result = await getProductBySlug({ slug: 'test-product' })

        expect(result.success).toBe(true)
        expect(result.data?.optimalSyncs?.requiredIds).toEqual(['id1', 'id2', 'id3'])
        expect(result.data?.optimalSyncs?.optionIds).toEqual([])
        expect(result.data?.optimalSyncs?.recommendedIds).toEqual([])
    })

    // 取得成功（重複 ID がある場合）
    it('should handle duplicate IDs correctly', async () => {
        const mockProductWithDuplicateIds = {
            ...mockProduct,
            product_relations: {
                optimal_syncs_required_id: 'id1,id2',
                optimal_syncs_option_id: 'id2,id3',
                optimal_syncs_recommended_id: 'id3,id4'
            }
        }
    
        mockGetProductBySlug.mockResolvedValue(mockProductWithDuplicateIds)
    
        const result = await getProductBySlug({ slug: 'test-product' })
    
        expect(result.data?.optimalSyncs?.requiredIds).toEqual(['id1', 'id2'])
        expect(result.data?.optimalSyncs?.optionIds).toEqual(['id3'])
        expect(result.data?.optimalSyncs?.recommendedIds).toEqual(['id4'])
    })

    // 取得成功（取得制限値を超える場合）
    it('should respect OPTIMAL_SYNCS_LIMIT', async () => {
        const manyIds = Array.from({ length: 20 }, (_, i) => `id${i}`).join(',')
        
        const mockProductWithManyIds = {
            ...mockProduct,
            product_relations: {
                optimal_syncs_required_id: manyIds,
                optimal_syncs_option_id: null,
                optimal_syncs_recommended_id: null
            }
        }    
        mockGetProductBySlug.mockResolvedValue(mockProductWithManyIds)
    
        const result = await getProductBySlug({ slug: 'test-product' })
    
        expect(result.data?.optimalSyncs?.requiredIds.length).toBeLessThanOrEqual(OPTIMAL_SYNCS_LIMIT)
    })

    // 取得失敗（商品データ無し）
    it('should return error when product not found', async () => {
        mockGetProductBySlug.mockResolvedValue(null)

        const result = await getProductBySlug({ slug: 'test-product' })

        expect(result.success).toBe(false)
        expect(result.error).toBe(NOT_FOUND)
        expect(result.data).toBeNull()
    })

    // 取得失敗（例外発生）
    it('should return error when exception occurs', async () => {
        mockGetProductBySlug.mockRejectedValue(new Error('Database connection failed'))
    
        const result = await getProductBySlug({ slug: 'test-product' })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(FETCH_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Get Product By Product Id Test
==================================== */
describe('getProductByProductId', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should return product data successfully', async () => {
        mockGetProductByProductId.mockResolvedValue(mockProduct)

        const result = await getProductByProductId({ productId: 'product_123' })

        expect(result.data).toEqual(mockProduct)
    })

    // 取得失敗
    it('should return error when product not found', async () => {
        mockGetProductByProductId.mockResolvedValue(null)

        const result = await getProductByProductId({ productId: 'product_123' })

        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Get Products By Ids Test
==================================== */
describe('getProductsByIds', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should return product data successfully', async () => {
        mockGetProductsByIds.mockResolvedValue([mockProduct])

        const result = await getProductsByIds({ 
            ids: ['product_123'], 
            pageType: SYNC_CONDITIONS 
        })

        expect(result.data).toEqual([mockProduct])
    })

    // 取得失敗
    it('should return error when products not found', async () => {
        mockGetProductsByIds.mockResolvedValue([])

        const result = await getProductsByIds({ 
            ids: ['product_123'], 
            pageType: SYNC_CONDITIONS 
        })

        expect(result.data).toEqual([])
    })
})

/* ==================================== 
    Get All Categories Products Sales Volume Test
==================================== */
describe('getAllCategoriesProductsSalesVolume', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should return product data successfully', async () => {
        mockGetAllCategoriesProducts.mockResolvedValue([{
            category: 'test-category',
            products: [mockProduct],
            totalCount: 1
        }])

        const result = await getAllCategoriesProductsSalesVolume({})

        expect(result.success).toBe(true)
        expect(result.data).toEqual([{
            category: 'test-category',
            products: [mockProduct],
            totalCount: 1
        }])
    })

    // 取得失敗
    it('should return error when exception occurs', async () => {
        mockGetAllCategoriesProducts.mockResolvedValue(null)

        const result = await getAllCategoriesProductsSalesVolume({})

        expect(result.success).toBe(false)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Get Paginated Products Test
==================================== */
describe('getPaginatedProducts', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should return product data successfully', async () => {
        mockGetPaginatedProducts.mockResolvedValue({
            category: 'test-category',
            products: [mockProduct],
            totalPages: 1,
            currentPage: 1,
            hasNextPage: false,
            hasPrevPage: false
        })

        const result = await getPaginatedProducts(mockPaginatedProducts)

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
    })

    // 取得失敗
    it('should return error when products not found', async () => {
        mockGetPaginatedProducts.mockResolvedValue(null)

        const result = await getPaginatedProducts(mockPaginatedProducts)

        expect(result.success).toBe(false)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Update Stock And Sold Count Test
==================================== */
describe('updateStockAndSoldCount', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 更新成功（単一商品の場合）
    it('should update stock and sold count successfully for single product', async () => {
        const mockProductUpdates = [
            { productId: 'product_123', quantity: 5 }
        ]

        const mockUpdateProductStock = vi.fn().mockResolvedValue(undefined)
        const mockUpdateProductSoldCount = vi.fn().mockResolvedValue(undefined)

        const mockTransaction = vi.fn().mockImplementation(async (callback) => {
            return await callback({})
        })

        vi.mocked(prisma.$transaction).mockImplementation(mockTransaction)

        vi.mocked(updateProductRepository).mockReturnValue({
            updateProductStockWithTransaction: mockUpdateProductStock
        })
        vi.mocked(updateProductSaleRepository).mockReturnValue({
            updateProductSoldCountWithTransaction: mockUpdateProductSoldCount
        })

        const result = await updateStockAndSoldCount({ productUpdates: mockProductUpdates })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(mockUpdateProductStock).toHaveBeenCalledWith({
            productId: 'product_123',
            quantity: 5,
            tx: expect.any(Object)
        })
        expect(mockUpdateProductSoldCount).toHaveBeenCalledWith({
            productId: 'product_123',
            quantity: 5,
            tx: expect.any(Object)
        })
    })

    // 更新成功（複数商品の場合）
    it('should update stock and sold count successfully for single product', async () => {
        const mockProductUpdates = [
            { productId: 'product_123', quantity: 5 },
            { productId: 'product_456', quantity: 3 },
            { productId: 'product_789', quantity: 2 }
        ]

        const mockUpdateProductStock = vi.fn().mockResolvedValue(undefined)
        const mockUpdateProductSoldCount = vi.fn().mockResolvedValue(undefined)

        const mockTransaction = vi.fn().mockImplementation(async (callback) => {
            return await callback({})
        })

        vi.mocked(prisma.$transaction).mockImplementation(mockTransaction)

        vi.mocked(updateProductRepository).mockReturnValue({
            updateProductStockWithTransaction: mockUpdateProductStock
        })
        vi.mocked(updateProductSaleRepository).mockReturnValue({
            updateProductSoldCountWithTransaction: mockUpdateProductSoldCount
        })

        const result = await updateStockAndSoldCount({ productUpdates: mockProductUpdates })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(mockUpdateProductStock).toHaveBeenCalledWith({
            productId: 'product_123',
            quantity: 5,
            tx: expect.any(Object)
        })
        expect(mockUpdateProductSoldCount).toHaveBeenCalledWith({
            productId: 'product_123',
            quantity: 5,
            tx: expect.any(Object)
        })
    })

    // 更新失敗（在庫更新失敗）
    it('should handle error in product stock update', async () => {
        const mockProductUpdates = [
            { productId: 'product_123', quantity: 5 }
        ]
    
        const mockUpdateProductStock = vi.fn().mockRejectedValue(
            new Error('Stock update failed')
        )
        const mockUpdateProductSoldCount = vi.fn().mockResolvedValue(undefined)
    
        const mockTransaction = vi.fn().mockImplementation(async (callback) => {
            return await callback({})
        })
    
        vi.mocked(prisma.$transaction).mockImplementation(mockTransaction)

        vi.mocked(updateProductRepository).mockReturnValue({
            updateProductStockWithTransaction: mockUpdateProductStock
        })
        vi.mocked(updateProductSaleRepository).mockReturnValue({
            updateProductSoldCountWithTransaction: mockUpdateProductSoldCount
        })
    
        const result = await updateStockAndSoldCount({ productUpdates: mockProductUpdates })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_STOCK_AND_SOLD_COUNT_FAILED)
    })

    // 更新失敗（売り上げ数更新失敗）
    it('should handle error in product sold count update', async () => {
        const mockProductUpdates = [
            { productId: 'product_123', quantity: 5 }
        ]
    
        const mockUpdateProductStock = vi.fn().mockRejectedValue(undefined)
        const mockUpdateProductSoldCount = vi.fn().mockResolvedValue(
            new Error('Sold count update failed')
        )
    
        const mockTransaction = vi.fn().mockImplementation(async (callback) => {
            return await callback({})
        })
    
        vi.mocked(prisma.$transaction).mockImplementation(mockTransaction)

        vi.mocked(updateProductRepository).mockReturnValue({
            updateProductStockWithTransaction: mockUpdateProductStock
        })
        vi.mocked(updateProductSaleRepository).mockReturnValue({
            updateProductSoldCountWithTransaction: mockUpdateProductSoldCount
        })
    
        const result = await updateStockAndSoldCount({ productUpdates: mockProductUpdates })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_STOCK_AND_SOLD_COUNT_FAILED)
    })

    // 更新失敗（トランザクション内でエラー発生）
    it('should handle transaction error', async () => {
        const mockProductUpdates = [
            { productId: 'product_123', quantity: 5 }
        ]
    
        vi.mocked(prisma.$transaction).mockRejectedValue(
            new Error('Transaction failed')
        )
    
        const result = await updateStockAndSoldCount({ productUpdates: mockProductUpdates })
    
        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_STOCK_AND_SOLD_COUNT_FAILED)
    })
})