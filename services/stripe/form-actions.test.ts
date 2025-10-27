import { describe, it, expect, vi, beforeEach } from "vitest"

import { setDefaultShippingAddressAction } from "@/services/stripe/form-actions"
import { mockUser, mockShippingAddress } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SHIPPING_ADDRESS_ERROR, USER_STRIPE_ERROR } = ERROR_MESSAGES;

const { 
    MISSING_ID, 
    UPDATE_DEFAULT_UNAUTHORIZED,
    INDIVIDUAL_FETCH_FAILED,
    SET_DEFAULT_FAILED,
} = SHIPPING_ADDRESS_ERROR;
const { CUSTOMER_ID_FETCH_FAILED } = USER_STRIPE_ERROR;

vi.mock('@/lib/middleware/auth', () => ({
    actionAuth: vi.fn()
}))

vi.mock('@/services/shipping-address/actions', () => ({
    getShippingAddressById: vi.fn(),
    updateStripeAndDefaultShippingAddress: vi.fn()
}))

vi.mock('@/services/user/actions', () => ({
    getUser: vi.fn()
}))

const getMockActionAuth = async () => {
    const { actionAuth } = await import('@/lib/middleware/auth')
    return vi.mocked(actionAuth)
}

const getMockGetShippingAddressById = async () => {
    const { getShippingAddressById } = await import('@/services/shipping-address/actions')
    return vi.mocked(getShippingAddressById)
}

const getMockGetUser = async () => {
    const { getUser } = await import('@/services/user/actions')
    return vi.mocked(getUser)
}

const getMockUpdateStripeAndDefaultShippingAddress = async () => {
    const { updateStripeAndDefaultShippingAddress } = await import('@/services/shipping-address/actions')
    return vi.mocked(updateStripeAndDefaultShippingAddress)
}

/* ==================================== 
    Set Default Shipping Address Test
==================================== */
describe('setDefaultShippingAddressAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 設定成功
    it('should set default shipping address successfully', async () => {
        const actionAuth = await getMockActionAuth()
        const getShippingAddressById = await getMockGetShippingAddressById()
        const getUser = await getMockGetUser()
        const updateStripeAndDefaultShippingAddress = await getMockUpdateStripeAndDefaultShippingAddress()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        getShippingAddressById.mockResolvedValue({
            data: { ...mockShippingAddress }
        })

        getUser.mockResolvedValue({
            ...mockUser
        })

        updateStripeAndDefaultShippingAddress.mockResolvedValue({
            success: true,
            error: null,
        })

        const formData = new FormData()
        formData.set('newDefaultAddressId', mockShippingAddress.id)

        const result = await setDefaultShippingAddressAction(
            {
                success: true,
                error: null,
            },
            formData
        )

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 設定成功（customerId が null）
    it('should set default shipping address successfully when customerId is null', async () => {
        const actionAuth = await getMockActionAuth()
        const getShippingAddressById = await getMockGetShippingAddressById()
        const getUser = await getMockGetUser()
        const updateStripeAndDefaultShippingAddress = await getMockUpdateStripeAndDefaultShippingAddress()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        getShippingAddressById.mockResolvedValue({
            data: { ...mockShippingAddress }
        })

        getUser.mockResolvedValue({
            ...mockUser,
            user_stripes: {
                ...mockUser.user_stripes,
                customer_id: null as unknown as string,
            }
        })

        const formData = new FormData()
        formData.set('newDefaultAddressId', mockShippingAddress.id)

        const result = await setDefaultShippingAddressAction(
            {
                success: true,
                error: null,
            },
            formData
        )

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.timestamp).toBeDefined()
        
        expect(updateStripeAndDefaultShippingAddress).not.toHaveBeenCalled()
    })

    // 設定失敗(newDefaultAddressId 無し)
    it('should return error if newDefaultAddressId is not provided', async () => {
        const formData = new FormData()
        formData.set('newDefaultAddressId', '')

        const result = await setDefaultShippingAddressAction(
            {
                success: true,
                error: null,
            },
            formData
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(MISSING_ID)
        expect(result.timestamp).toBeDefined()
    })

    // 設定失敗(ユーザー認証失敗)
    it('should return error if user authorization fails', async () => {
        const actionAuth = await getMockActionAuth()

        actionAuth.mockResolvedValue({
            success: false,
            error: UPDATE_DEFAULT_UNAUTHORIZED,
        })

        const formData = new FormData()
        formData.set('newDefaultAddressId', mockShippingAddress.id)

        const result = await setDefaultShippingAddressAction(
            {
                success: true,
                error: null,
            },
            formData
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_DEFAULT_UNAUTHORIZED)
        expect(result.timestamp).toBeDefined()
    })

    // 設定失敗(住所の取得失敗)
    it('should return error if shipping address fetch fails', async () => {
        const actionAuth = await getMockActionAuth()
        const getShippingAddressById = await getMockGetShippingAddressById()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        getShippingAddressById.mockResolvedValue({
            data: null
        })

        const formData = new FormData()
        formData.set('newDefaultAddressId', mockShippingAddress.id)

        const result = await setDefaultShippingAddressAction(
            {
                success: true,
                error: null,
            },
            formData
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(INDIVIDUAL_FETCH_FAILED)
        expect(result.timestamp).toBeDefined()
    })

    // 設定失敗(Stripe 顧客IDの取得失敗)
    it('should return error if customer ID fetch fails', async () => {
        const actionAuth = await getMockActionAuth()
        const getShippingAddressById = await getMockGetShippingAddressById()
        const getUser = await getMockGetUser()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        getShippingAddressById.mockResolvedValue({
            data: { ...mockShippingAddress }
        })

        getUser.mockResolvedValue(null)

        const formData = new FormData()
        formData.set('newDefaultAddressId', mockShippingAddress.id)

        const result = await setDefaultShippingAddressAction(
            {
                success: true,
                error: null,
            },
            formData
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(CUSTOMER_ID_FETCH_FAILED)
        expect(result.timestamp).toBeDefined()
    })

    // 設定失敗(デフォルト住所の更新失敗)
    it('should return error if updateStripeAndDefaultShippingAddress fails', async () => {
        const actionAuth = await getMockActionAuth()
        const getShippingAddressById = await getMockGetShippingAddressById()
        const getUser = await getMockGetUser()
        const updateStripeAndDefaultShippingAddress = await getMockUpdateStripeAndDefaultShippingAddress()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        getShippingAddressById.mockResolvedValue({
            data: { ...mockShippingAddress }
        })

        getUser.mockResolvedValue({
            ...mockUser
        })

        updateStripeAndDefaultShippingAddress.mockRejectedValue({
            success: false,
            error: 'test_error',
        })

        const formData = new FormData()
        formData.set('newDefaultAddressId', mockShippingAddress.id)

        const result = await setDefaultShippingAddressAction(
            {
                success: true,
                error: null,
            },
            formData
        )

        expect(result.success).toBe(false)
        expect(result.error).toBe(SET_DEFAULT_FAILED)
        expect(result.timestamp).toBeDefined()
    })
})