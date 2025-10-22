import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    createUserStripeCustomerId
} from "@/services/user-stripe/actions"

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
        mockCreateUserStripeCustomerId.mockResolvedValue({ success: true })

        const result = await createUserStripeCustomerId({
            userId: 'test-user-id',
            customerId: 'test-customer-id'
        })

        expect(result.success).toBe(true)
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateUserStripeCustomerId.mockResolvedValue(null)

        const result = await createUserStripeCustomerId({
            userId: '',
            customerId: ''
        })

        expect(result.success).toBe(false)
    })
})