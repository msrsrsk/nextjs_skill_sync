import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    createShippingAddressAction,
    updateShippingAddressAction,
    updateDefaultShippingAddressAction
} from "@/services/shipping-address/form-actions"
import { mockShippingAddress, mockUser } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SHIPPING_ADDRESS_ERROR, USER_STRIPE_ERROR } = ERROR_MESSAGES;

const { 
    ADD_UNAUTHORIZED,
    CREATE_FAILED,
    UPDATE_UNAUTHORIZED,
    MISSING_ID,
    UPDATE_FAILED,
} = SHIPPING_ADDRESS_ERROR;
const { CUSTOMER_ID_FETCH_FAILED } = USER_STRIPE_ERROR;

vi.mock('@/lib/middleware/auth', () => ({
    actionAuth: vi.fn()
}))

vi.mock('@/services/user/actions', () => ({
    getUser: vi.fn()
}))

vi.mock('@/services/shipping-address/actions', () => ({
    createShippingAddress: vi.fn(),
    updateShippingAddress: vi.fn(),
    updateStripeAndShippingAddress: vi.fn()
}))

const getMockActionAuth = async () => {
    const { actionAuth } = await import('@/lib/middleware/auth')
    return vi.mocked(actionAuth)
}

const getMockGetUser = async () => {
    const { getUser } = await import('@/services/user/actions')
    return vi.mocked(getUser)
}

const getMockCreateShippingAddress = async () => {
    const { createShippingAddress } = await import('@/services/shipping-address/actions')
    return vi.mocked(createShippingAddress)
}

const getMockUpdateShippingAddress = async () => {
    const { updateShippingAddress } = await import('@/services/shipping-address/actions')
    return vi.mocked(updateShippingAddress)
}

const getMockUpdateStripeAndShippingAddress = async () => {
    const { updateStripeAndShippingAddress } = await import('@/services/shipping-address/actions')
    return vi.mocked(updateStripeAndShippingAddress)
}

/* ==================================== 
    Create Shipping Address Test
==================================== */
describe('createShippingAddressAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockFormData = new FormData()
    mockFormData.set('name', 'test_name')
    mockFormData.set('postal_code', '1234567')
    mockFormData.set('state', 'test_state')
    mockFormData.set('address_line1', 'test_address_line1')
    mockFormData.set('address_line2', 'test_address_line2')

    const prevState = {
        success: false,
        error: null,
        data: null,
        timestamp: Date.now()
    }

    // 作成成功
    it('should create shipping address successfully', async () => {
        const actionAuth = await getMockActionAuth()
        const mockCreateShippingAddress = await getMockCreateShippingAddress()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockCreateShippingAddress.mockResolvedValue({
            success: true,
            error: null,
            data: mockShippingAddress
        })
        
        const result = await createShippingAddressAction(prevState, mockFormData)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗(認証失敗)
    it('should create shipping address failed', async () => {
        const actionAuth = await getMockActionAuth()

        actionAuth.mockResolvedValue({
            success: false,
            error: ADD_UNAUTHORIZED,
        })

        const result = await createShippingAddressAction(prevState, mockFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(ADD_UNAUTHORIZED)
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗(配送先住所の作成失敗)
    it('should create shipping address failed', async () => {
        const actionAuth = await getMockActionAuth()
        const mockCreateShippingAddress = await getMockCreateShippingAddress()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockCreateShippingAddress.mockResolvedValue({
            success: false,
            error: CREATE_FAILED,
            data: null
        })
        
        const result = await createShippingAddressAction(prevState, mockFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗(配送先住所の作成の例外発生)
    it('should create shipping address failed', async () => {
        const actionAuth = await getMockActionAuth()
        const mockCreateShippingAddress = await getMockCreateShippingAddress()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockCreateShippingAddress.mockRejectedValue(
            new Error('Database error')
        )
        
        const result = await createShippingAddressAction(prevState, mockFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗(formData が空)
    it('should handle empty FormData', async () => {
        const emptyFormData = new FormData()

        const actionAuth = await getMockActionAuth()
        const mockCreateShippingAddress = await getMockCreateShippingAddress()
        
        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })
    
        mockCreateShippingAddress.mockResolvedValue({
            success: true,
            error: null,
            data: mockShippingAddress
        })
    
        const result = await createShippingAddressAction(prevState, emptyFormData)
    
        expect(result.success).toBe(true)
        expect(mockCreateShippingAddress).toHaveBeenCalledWith({
            address: {
                user_id: 'user_test_123',
                name: null,
                postal_code: null,
                state: null,
                address_line1: null,
                address_line2: null,
                is_default: false,
            }
        })
    })

    // 作成失敗(例外発生)
    it('should create shipping address successfully', async () => {
        const actionAuth = await getMockActionAuth()
        const mockCreateShippingAddress = await getMockCreateShippingAddress()
    
        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })
    
        mockCreateShippingAddress.mockRejectedValue(new Error('Database error'))
    
        const result = await createShippingAddressAction(prevState, mockFormData)
    
        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })
})

/* ==================================== 
    Update Shipping Address Test
==================================== */
describe('updateShippingAddressAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockFormData = new FormData()
    mockFormData.set('id', 'test_id')
    mockFormData.set('name', 'test_name')
    mockFormData.set('postal_code', '1234567')
    mockFormData.set('state', 'test_state')
    mockFormData.set('address_line1', 'test_address_line1')
    mockFormData.set('address_line2', 'test_address_line2')

    const prevState = {
        success: false,
        error: null,
        data: null,
        timestamp: Date.now()
    }

    // 更新成功
    it('should create shipping address successfully', async () => {
        const actionAuth = await getMockActionAuth()
        const mockUpdateShippingAddress = await getMockUpdateShippingAddress()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockUpdateShippingAddress.mockResolvedValue({
            success: true,
            data: mockShippingAddress
        })
        
        const result = await updateShippingAddressAction(prevState, mockFormData)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
        expect(result.timestamp).toBeDefined()
    })

    // 更新失敗(id 無し)
    it('should update shipping address failed with missing id', async () => {
        const emptyFormData = new FormData()

        const result = await updateShippingAddressAction(prevState, emptyFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(MISSING_ID)
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗(認証失敗)
    it('should update shipping address failed with authorization error', async () => {
        const actionAuth = await getMockActionAuth()

        actionAuth.mockResolvedValue({
            success: false,
            error: UPDATE_UNAUTHORIZED,
        })

        const result = await updateShippingAddressAction(prevState, mockFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_UNAUTHORIZED)
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 更新失敗(配送先住所の更新失敗)
    it('should update shipping address failed with repository error', async () => {
        const actionAuth = await getMockActionAuth()
        const mockUpdateShippingAddress = await getMockUpdateShippingAddress()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockUpdateShippingAddress.mockResolvedValue({
            success: false,
            data: null as unknown as ShippingAddress
        })
        
        const result = await updateShippingAddressAction(prevState, mockFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_FAILED)
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 更新失敗(例外発生)
    it('should update shipping address failed with exception', async () => {
        const actionAuth = await getMockActionAuth()
        const mockUpdateShippingAddress = await getMockUpdateShippingAddress()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockUpdateShippingAddress.mockRejectedValue(new Error('Database error'))

        const result = await updateShippingAddressAction(prevState, mockFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Database error')
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })
})

/* ==================================== 
    Update Default Shipping Address Test
==================================== */
describe('updateDefaultShippingAddressAction', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockFormData = new FormData()
    mockFormData.set('id', 'test_id')
    mockFormData.set('name', 'test_name')
    mockFormData.set('postal_code', '1234567')
    mockFormData.set('state', 'test_state')
    mockFormData.set('address_line1', 'test_address_line1')
    mockFormData.set('address_line2', 'test_address_line2')

    const prevState = {
        success: false,
        error: null,
        data: null,
        timestamp: Date.now()
    }

    // 更新成功
    it('should update default shipping address successfully', async () => {
        const actionAuth = await getMockActionAuth()
        const mockGetUser = await getMockGetUser()

        const updateStripeAndShippingAddress = await getMockUpdateStripeAndShippingAddress()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockGetUser.mockResolvedValue(mockUser)

        updateStripeAndShippingAddress.mockResolvedValue({
            success: true,
            error: null,
            data: mockShippingAddress
        })

        const result = await updateDefaultShippingAddressAction(prevState, mockFormData)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
        expect(result.timestamp).toBeDefined()
    })

    // 更新失敗(id 無し)
    it('should update default shipping address failed with missing id', async () => {
        const emptyFormData = new FormData()

        const result = await updateDefaultShippingAddressAction(prevState, emptyFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(MISSING_ID)
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗(認証失敗)
    it('should update default shipping address failed with authorization error', async () => {
        const actionAuth = await getMockActionAuth()

        actionAuth.mockResolvedValue({
            success: false,
            error: UPDATE_UNAUTHORIZED,
        })

        const result = await updateDefaultShippingAddressAction(prevState, mockFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_UNAUTHORIZED)
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗(ユーザーの取得失敗)
    it('should update default shipping address failed with user fetch error', async () => {
        const actionAuth = await getMockActionAuth()
        const mockGetUser = await getMockGetUser()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockGetUser.mockResolvedValue(null)

        const result = await updateDefaultShippingAddressAction(prevState, mockFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(CUSTOMER_ID_FETCH_FAILED)
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 作成失敗(Stripe の顧客 ID の取得失敗)
    it('should update default shipping address failed with customer id fetch error', async () => {
        const actionAuth = await getMockActionAuth()
        const mockGetUser = await getMockGetUser()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockGetUser.mockResolvedValue({
            ...mockUser,
            user_stripes: {
                ...mockUser.user_stripes,
                customer_id: null as unknown as string,
            }
        })

        const result = await updateDefaultShippingAddressAction(prevState, mockFormData)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
        expect(result.timestamp).toBeDefined()
    })

    // 更新失敗(配送先住所の更新失敗)
    it('should update default shipping address failed with repository error', async () => {
        const actionAuth = await getMockActionAuth()
        const mockGetUser = await getMockGetUser()
        const updateStripeAndShippingAddress = await getMockUpdateStripeAndShippingAddress()

        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })

        mockGetUser.mockResolvedValue(mockUser)

        updateStripeAndShippingAddress.mockResolvedValue({
            success: false,
            error: UPDATE_FAILED,
            data: null
        })
        
        const result = await updateDefaultShippingAddressAction(prevState, mockFormData)

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_FAILED)
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    // 例外発生（認証エラー）
    it('should return error when actionAuth throws exception', async () => {
        const actionAuth = await getMockActionAuth()
        
        actionAuth.mockRejectedValue(new Error('Auth service error'))
        
        const result = await updateDefaultShippingAddressAction(prevState, mockFormData)
        
        expect(result.success).toBe(false)
        expect(result.error).toBe('Auth service error')
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })

    it('should return error when updateStripeAndShippingAddress throws exception', async () => {
        const actionAuth = await getMockActionAuth()
        const mockGetUser = await getMockGetUser()
        const updateStripeAndShippingAddress = await getMockUpdateStripeAndShippingAddress()
        
        actionAuth.mockResolvedValue({
            success: true,
            userId: 'user_test_123'
        })
        
        mockGetUser.mockResolvedValue(mockUser)
        
        updateStripeAndShippingAddress.mockRejectedValue(new Error('Stripe update error'))
        
        const result = await updateDefaultShippingAddressAction(prevState, mockFormData)
        
        expect(result.success).toBe(false)
        expect(result.error).toBe('Stripe update error')
        expect(result.data).toBeNull()
        expect(result.timestamp).toBeDefined()
    })
})