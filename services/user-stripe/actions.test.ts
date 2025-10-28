import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    createUserStripeCustomerId
} from "@/services/user-stripe/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_STRIPE_ERROR } = ERROR_MESSAGES;
const { CUSTOMER_ID_UPDATE_FAILED } = USER_STRIPE_ERROR;

const mockCreateUserStripeCustomerId = vi.fn()

vi.mock('@/repository/userStripe', () => ({
    createUserStripeRepository: () => ({
        createUserStripeCustomerId: mockCreateUserStripeCustomerId
    })
}))

/* ==================================== 
    Create User Stripe Customer Id Test
==================================== */
describe('createUserStripeCustomerId', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create user stripe customer id successfully', async () => {
        mockCreateUserStripeCustomerId.mockResolvedValue(true)

        const result = await createUserStripeCustomerId({
            userId: 'test-user-id',
            customerId: 'test-customer-id'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成失敗
    it('should return failure when update user stripe customer id repository fails', async () => {
        mockCreateUserStripeCustomerId.mockResolvedValue(false)

        const result = await createUserStripeCustomerId({
            userId: '',
            customerId: ''
        })

        expect(result.success).toBe(false)  
        expect(result.error).toBe(CUSTOMER_ID_UPDATE_FAILED)
    })

    // 作成失敗(例外発生)
    it('should return failure when update user stripe customer id database update exception occurs', async () => {
        mockCreateUserStripeCustomerId.mockRejectedValue(
            new Error('Database error')
        )

        const result = await createUserStripeCustomerId({
            userId: '',
            customerId: ''
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CUSTOMER_ID_UPDATE_FAILED)
    })
})