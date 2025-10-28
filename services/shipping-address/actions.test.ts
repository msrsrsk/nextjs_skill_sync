import { describe, it, expect, vi, beforeEach } from "vitest"

import {
    createShippingAddress,
    getDefaultShippingAddress,
    getShippingAddressById,
    updateShippingAddress,
    updateStripeAndShippingAddress,
    updateStripeAndDefaultShippingAddress,
    setDefaultShippingAddress,
    deleteShippingAddress
} from "@/services/shipping-address/actions"
import { updateCustomerShippingAddress } from "@/services/stripe/actions"
import { mockShippingAddress } from "@/__tests__/mocks/domain-mocks"
import { mockCustomer } from "@/__tests__/mocks/stripe-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SHIPPING_ADDRESS_ERROR } = ERROR_MESSAGES;

const { MISSING_USER_INFO, SET_DEFAULT_FAILED, CREATE_FAILED, DELETE_FAILED } = SHIPPING_ADDRESS_ERROR;

vi.mock('@/lib/clients/stripe/client', () => ({
    stripe: {
        customers: {
            update: vi.fn(),
            retrieve: vi.fn()
        }
    }
}))

const mockCreateShippingAddress = vi.fn()
const mockGetDefaultShippingAddress = vi.fn()
const mockGetShippingAddressById = vi.fn()
const mockUpdateShippingAddress = vi.fn()
const mockSetDefaultShippingAddress = vi.fn()
const mockDeleteShippingAddress = vi.fn()

vi.mock('@/repository/shippingAddress', () => ({
    createShippingAddressRepository: () => ({
        createShippingAddress: mockCreateShippingAddress
    }),
    getShippingAddressRepository: () => ({
        getUserDefaultShippingAddress: mockGetDefaultShippingAddress,
        getShippingAddressById: mockGetShippingAddressById
    }),
    updateShippingAddressRepository: () => ({
        updateShippingAddress: mockUpdateShippingAddress,
        updateDefaultShippingAddressesWithTransaction: mockSetDefaultShippingAddress
    }),
    deleteShippingAddressRepository: () => ({
        deleteShippingAddress: mockDeleteShippingAddress
    })
}))

vi.mock('@/services/stripe/actions', () => ({
    updateCustomerShippingAddress: vi.fn()
}))

/* ==================================== 
    Create Shipping Address Test
==================================== */
describe('createShippingAddress', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create shipping address successfully', async () => {
        mockCreateShippingAddress.mockResolvedValue(mockShippingAddress)

        const result = await createShippingAddress({
            address: mockShippingAddress
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toEqual(mockShippingAddress)
        expect(mockCreateShippingAddress).toHaveBeenCalledWith({
            address: mockShippingAddress
        })
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateShippingAddress.mockResolvedValue(false)

        const result = await createShippingAddress({
            address: null as unknown as ShippingAddress
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗(例外発生)
    it('should return failure when exception occurs', async () => {
        mockCreateShippingAddress.mockRejectedValue(new Error('Database error'))

        const result = await createShippingAddress({
            address: null as unknown as ShippingAddress
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Get Default Shipping Address Test
==================================== */
describe('getDefaultShippingAddress', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should get default shipping address successfully', async () => {
        mockGetDefaultShippingAddress.mockResolvedValue(mockShippingAddress)

        const result = await getDefaultShippingAddress({
            userId: 'user_test_123'
        })

        expect(result.data).toBeDefined()
    })

    // 取得失敗
    it('should return failure when repository fails', async () => {
        mockGetDefaultShippingAddress.mockResolvedValue(null)

        const result = await getDefaultShippingAddress({
            userId: 'user_test_123'
        })

        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Get Shipping Address By Id Test
==================================== */
describe('getShippingAddressById', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should get shipping address by id successfully', async () => {
        mockGetShippingAddressById.mockResolvedValue(mockShippingAddress)

        const result = await getShippingAddressById({
            userId: 'user_test_123',
            addressId: mockShippingAddress.id
        })

        expect(result.data).toBeDefined()
    })

    // 取得失敗
    it('should return failure when repository fails', async () => {
        mockGetShippingAddressById.mockResolvedValue(null)

        const result = await getShippingAddressById({
            userId: 'user_test_123',
            addressId: mockShippingAddress.id
        })

        expect(result.data).toBeNull()
    })
})
/* ==================================== 
    Update Shipping Address Test
==================================== */
describe('updateShippingAddress', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 更新成功
    it('should update shipping address successfully', async () => {
        mockUpdateShippingAddress.mockResolvedValue(mockShippingAddress)

        const result = await updateShippingAddress({
            id: mockShippingAddress.id,
            userId: 'user_test_123',
            shippingAddress: mockShippingAddress
        })

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
    })

    // 更新失敗
    it('should return failure when repository fails', async () => {
        mockUpdateShippingAddress.mockResolvedValue(null)

        const result = await updateShippingAddress({
            id: mockShippingAddress.id,
            userId: 'user_test_123',
            shippingAddress: mockShippingAddress
        })

        expect(result.success).toBe(false)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Update Stripe And Shipping Address Test
==================================== */
describe('updateStripeAndShippingAddress', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        id: mockShippingAddress.id,
        userId: 'user_test_123',
        customerId: mockCustomer.id,
        shippingAddress: mockShippingAddress
    }

    // 更新成功
    it('should update stripe and shipping address successfully', async () => {
        const mockUpdateCustomerShippingAddress = vi.mocked(updateCustomerShippingAddress)

        mockUpdateCustomerShippingAddress.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })

        mockUpdateShippingAddress.mockResolvedValue({
            success: true,
            data: mockShippingAddress
        })

        const result = await updateStripeAndShippingAddress(commonParams)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 更新失敗(customerId 無し)
    it('should return failure when customerId is not provided', async () => {
        const mockUpdateCustomerShippingAddress = vi.mocked(updateCustomerShippingAddress)

        mockUpdateCustomerShippingAddress.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })

        mockUpdateShippingAddress.mockResolvedValue({
            success: true,
            data: mockShippingAddress
        })

        const result = await updateStripeAndShippingAddress({
            ...commonParams,
            customerId: null as unknown as StripeCustomerId
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 更新失敗（id 無し）
    it('should return failure when id is not provided', async () => {
        const result = await updateStripeAndShippingAddress({
            ...commonParams,
            id: null as unknown as ShippingAddressId
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(MISSING_USER_INFO)
        expect(result.data).toBeNull()
    })

    // 更新失敗（userId 無し）
    it('should return failure when userId is not provided', async () => {
        const result = await updateStripeAndShippingAddress({
            ...commonParams,
            userId: null as unknown as UserId
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(MISSING_USER_INFO)
        expect(result.data).toBeNull()
    })

    // 更新失敗（shippingAddress 無し）
    it('should return failure when shippingAddress is not provided', async () => {
        const result = await updateStripeAndShippingAddress({
            ...commonParams,
            shippingAddress: null as unknown as ShippingAddress
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(MISSING_USER_INFO)
        expect(result.data).toBeNull()
    })

    // 更新失敗(例外発生)
    it('should throw error when Stripe update fails', async () => {
        const mockUpdateCustomerShippingAddress = vi.mocked(updateCustomerShippingAddress)

        mockUpdateCustomerShippingAddress.mockResolvedValue({
            success: false,
            error: 'Stripe API Error',
            data: null
        })

        mockUpdateShippingAddress.mockResolvedValue({
            success: true,
            data: mockShippingAddress
        })

        const result = await updateStripeAndShippingAddress(commonParams)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Stripe API Error')
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Update Stripe And Default Shipping Address Test
==================================== */
describe('updateStripeAndDefaultShippingAddress', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const commonParams = {
        id: mockShippingAddress.id,
        userId: 'user_test_123',
        customerId: mockCustomer.id,
        shippingAddress: mockShippingAddress
    }

    // 更新成功
    it('should update stripe and default shipping address successfully', async () => {
        const mockUpdateCustomerShippingAddress = vi.mocked(updateCustomerShippingAddress)

        mockUpdateCustomerShippingAddress.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })

        mockSetDefaultShippingAddress.mockResolvedValue({
            success: true,
            data: mockShippingAddress
        })

        const result = await updateStripeAndDefaultShippingAddress(commonParams)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 更新失敗(customerId 無し)
    it('should return failure when customerId is not provided', async () => {
        const mockUpdateCustomerShippingAddress = vi.mocked(updateCustomerShippingAddress)

        mockUpdateCustomerShippingAddress.mockResolvedValue({
            success: true,
            error: null,
            data: mockCustomer
        })

        mockSetDefaultShippingAddress.mockResolvedValue({
            success: true,
            data: mockShippingAddress
        })

        const result = await updateStripeAndDefaultShippingAddress(commonParams)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 更新失敗（id 無し）
    it('should return failure when id is not provided', async () => {
        const result = await updateStripeAndDefaultShippingAddress({
            ...commonParams,
            id: null as unknown as ShippingAddressId
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(MISSING_USER_INFO)
    })

    // 更新失敗（userId 無し）
    it('should return failure when userId is not provided', async () => {
        const result = await updateStripeAndDefaultShippingAddress({
            ...commonParams,
            userId: null as unknown as UserId
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(MISSING_USER_INFO)
    })

    // 更新失敗（shippingAddress 無し）
    it('should return failure when shippingAddress is not provided', async () => {
        const result = await updateStripeAndDefaultShippingAddress({
            ...commonParams,
            shippingAddress: null as unknown as ShippingAddress
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(MISSING_USER_INFO)
    })

    // 更新失敗(例外発生)
    it('should throw error when Stripe update fails', async () => {
        const mockUpdateCustomerShippingAddress = vi.mocked(updateCustomerShippingAddress)

        mockUpdateCustomerShippingAddress.mockResolvedValue({
            success: false,
            error: 'Stripe API Error',
            data: null
        })

        mockSetDefaultShippingAddress.mockResolvedValue({
            success: true,
            data: mockShippingAddress
        })

        const result = await updateStripeAndDefaultShippingAddress(commonParams)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Stripe API Error')
    })
})

/* ==================================== 
    Set Default Shipping Address Test
==================================== */
describe('setDefaultShippingAddress', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 設定成功
    it('should set default shipping address successfully', async () => {
        mockSetDefaultShippingAddress.mockResolvedValue(mockShippingAddress)

        const result = await setDefaultShippingAddress({
            userId: 'user_test_123',
            addressId: mockShippingAddress.id
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 設定失敗
    it('should return failure when repository fails', async () => {
        mockSetDefaultShippingAddress.mockRejectedValue(
            new Error('Database Error')
        )

        const result = await setDefaultShippingAddress({
            userId: 'user_test_123',
            addressId: mockShippingAddress.id
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(SET_DEFAULT_FAILED)
    })
})

/* ==================================== 
    Delete Shipping Address Test
==================================== */
describe('deleteShippingAddress', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 削除成功
    it('should delete shipping address successfully', async () => {
        mockDeleteShippingAddress.mockResolvedValue(true)

        const result = await deleteShippingAddress({
            id: mockShippingAddress.id,
            userId: 'user_test_123'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 削除失敗
    it('should return failure when repository fails', async () => {
        mockDeleteShippingAddress.mockResolvedValue(false)

        const result = await deleteShippingAddress({
            id: mockShippingAddress.id,
            userId: 'user_test_123'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
    })

    // 削除失敗(例外発生)
    it('should return failure when exception occurs', async () => {
        mockDeleteShippingAddress.mockRejectedValue(new Error('Database error'))

        const result = await deleteShippingAddress({
            id: mockShippingAddress.id,
            userId: 'user_test_123'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(DELETE_FAILED)
    })
})