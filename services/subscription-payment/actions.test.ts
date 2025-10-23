import { describe, it, expect, vi, beforeEach } from "vitest"

import {
    createSubscriptionPayment,
    updateSubscriptionPaymentStatus
} from "@/services/subscription-payment/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SUBSCRIPTION_PAYMENT_ERROR } = ERROR_MESSAGES;

const { GET_LATEST_FAILED, UPDATE_FAILED } = SUBSCRIPTION_PAYMENT_ERROR;

const mockCreateSubscriptionPayment = vi.fn()
const mockGetSubscriptionPayment = vi.fn()
const mockUpdateSubscriptionPayment = vi.fn()
const mockUpdateSubscriptionPaymentStatus = vi.fn()

vi.mock('@/repository/subscriptionPayment', () => ({
    createSubscriptionPaymentRepository: () => ({
        createSubscriptionPayment: mockCreateSubscriptionPayment
    }),
    getSubscriptionPaymentRepository: () => ({
        getSubscriptionPayment: mockGetSubscriptionPayment
    }),
    updateSubscriptionPaymentRepository: () => ({
        updateSubscriptionPayment: mockUpdateSubscriptionPayment,
        updateSubscriptionPaymentStatus: mockUpdateSubscriptionPaymentStatus
    })
}))

/* ==================================== 
    Create Subscription Payment Test
==================================== */
describe('createSubscriptionPayment', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create subscription payment successfully', async () => {
        mockCreateSubscriptionPayment.mockResolvedValue({ success: true })

        const result = await createSubscriptionPayment({
            subscriptionPaymentData: {
                id: 'test-subscription-payment-id',
                user_id: 'test-user-id',
                subscription_id: 'test-subscription-id',
                payment_date: new Date(),
                status: 'pending',
                created_at: new Date(),
                updated_at: new Date()
            }
        })

        expect(result.success).toBe(true)
        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateSubscriptionPayment.mockResolvedValue(null)

        const result = await createSubscriptionPayment({
            subscriptionPaymentData: {
                id: '',
                user_id: '',
                subscription_id: '',
                payment_date: new Date(),
                status: 'pending',
                created_at: new Date(),
                updated_at: new Date()
            }
        })

        expect(result.success).toBe(false)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Update Subscription Payment Status Test
==================================== */
describe('updateSubscriptionPaymentStatus', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 更新成功
    it('should update subscription payment status successfully', async () => {
        mockGetSubscriptionPayment.mockResolvedValue({
            id: 'test-subscription-payment-id',
        })
        mockUpdateSubscriptionPayment.mockResolvedValue({
            id: 'test-subscription-payment-id',
        })
        mockUpdateSubscriptionPaymentStatus.mockResolvedValue({ success: true })

        const result = await updateSubscriptionPaymentStatus({
            subscriptionId: 'test-subscription-id',
            status: 'succeeded'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 更新失敗(サブスクリプションの支払いデータの取得失敗)
    it('should return failure when get subscription payment fails', async () => {
        mockGetSubscriptionPayment.mockResolvedValue(null)

        const result = await updateSubscriptionPaymentStatus({
            subscriptionId: 'test-subscription-id',
            status: 'succeeded'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(GET_LATEST_FAILED)
        expect(result.data).toBeNull()
    })

    // 更新失敗(サブスクリプションの支払いデータの更新失敗)
    it('should return failure when update subscription payment status fails', async () => {
        mockGetSubscriptionPayment.mockResolvedValue({
            id: 'test-subscription-payment-id',
        })
        mockUpdateSubscriptionPayment.mockResolvedValue({
            id: 'test-subscription-payment-id',
        })
        mockUpdateSubscriptionPaymentStatus.mockResolvedValue(null)

        const result = await updateSubscriptionPaymentStatus({
            subscriptionId: 'test-subscription-id',
            status: 'failed'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(UPDATE_FAILED)
        expect(result.data).toBeNull()
    })
})