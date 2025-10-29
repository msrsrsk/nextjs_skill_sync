import { describe, it, expect, vi, beforeEach } from "vitest"

import { processNotificationWebhook } from "@/services/notification/actions"
import { mockProductStockRecord, mockChatRecord } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { NOTIFICATION_ERROR, EMAIL_ERROR } = ERROR_MESSAGES;

const { WEBHOOK_PROCESS_FAILED } = NOTIFICATION_ERROR;
const { STOCK_SEND_FAILED, CHAT_SEND_FAILED } = EMAIL_ERROR;

const mockGetNotificationWithDetails = vi.fn()
const mockReceiveStockNotificationEmail = vi.fn()
const mockReceiveChatNotificationEmail = vi.fn()

vi.mock('@/repository/notification', () => ({
    getNotificationRepository: vi.fn()
}))

vi.mock('@/services/email/notification/stock', () => ({
    receiveStockNotificationEmail: vi.fn()
}))

vi.mock('@/services/email/notification/chat', () => ({
    receiveChatNotificationEmail: vi.fn()
}))

// ヘルパー関数を定義
const getNotificationRepository = async () => {
    const { getNotificationRepository } = await import('@/repository/notification')
    return vi.mocked(getNotificationRepository)
}

const getMockReceiveStockNotificationEmail = async () => {
    const { receiveStockNotificationEmail } = await import('@/services/email/notification/stock')
    return vi.mocked(receiveStockNotificationEmail)
}

const getMockReceiveChatNotificationEmail = async () => {
    const { receiveChatNotificationEmail } = await import('@/services/email/notification/chat')
    return vi.mocked(receiveChatNotificationEmail)
}

/* ==================================== 
    Process Notification Webhook Test
==================================== */
describe('processNotificationWebhook', () => {
    beforeEach(async () => {
        vi.clearAllMocks()

        const mockNotificationRepository = await getNotificationRepository()
        mockNotificationRepository.mockReturnValue({
            getNotificationWithDetails: mockGetNotificationWithDetails
        })
    })

    const mockProductStockNotificationWithDetails = {
        ...mockProductStockRecord,
        relatedData: {
            id: 'product-1',
            title: 'Test Product'
        }
    }

    const mockChatNotificationWithDetails = {
        ...mockChatRecord,
        relatedData: {
            id: 'chat-1',
            chat_room_id: 'room-1',
            message: 'Test message',
            sent_at: new Date()
        }
    }

    // 処理成功（product_stock の場合）
    it('should process product_stock notification successfully', async () => {
        const mockReceiveStockNotificationEmail = await getMockReceiveStockNotificationEmail()

        mockGetNotificationWithDetails.mockResolvedValue(mockProductStockNotificationWithDetails);
        mockReceiveStockNotificationEmail.mockResolvedValue({
            success: true,
            error: undefined
        })

        const result = await processNotificationWebhook({ 
            record: mockProductStockRecord as NotificationData
        });

        expect(mockGetNotificationWithDetails).toHaveBeenCalledWith(mockProductStockRecord);
        expect(mockReceiveStockNotificationEmail).toHaveBeenCalledWith(mockProductStockNotificationWithDetails);
        expect(result.success).toBe(true)
        expect(result.error).toBeUndefined()
    })

    // 処理成功（chat の場合）
    it('should process chat notification successfully', async () => {
        const mockReceiveChatNotificationEmail = await getMockReceiveChatNotificationEmail()

        mockGetNotificationWithDetails.mockResolvedValue(mockChatNotificationWithDetails);
        mockReceiveChatNotificationEmail.mockResolvedValue({
            success: true,
            error: undefined
        })

        const result = await processNotificationWebhook({ 
            record: mockChatRecord as NotificationData
        })

        expect(mockGetNotificationWithDetails).toHaveBeenCalledWith(mockChatRecord);
        expect(mockReceiveChatNotificationEmail).toHaveBeenCalledWith(mockChatNotificationWithDetails);
        expect(result.success).toBe(true)
        expect(result.error).toBeUndefined()
    })

    // 処理失敗（product_stock でエラー）
    it('should process notification webhook failed with product_stock error', async () => {
        const mockReceiveStockNotificationEmail = await getMockReceiveStockNotificationEmail()

        mockGetNotificationWithDetails.mockResolvedValue(mockProductStockNotificationWithDetails);

        mockReceiveStockNotificationEmail.mockResolvedValue({
            success: false,
            error: STOCK_SEND_FAILED
        })
        const result = await processNotificationWebhook({ record: mockProductStockRecord as NotificationData });

        expect(result.success).toBe(false)
        expect(result.error).toBe(STOCK_SEND_FAILED);
    })

    // 処理失敗（chat でエラー）
    it('should process notification webhook failed with chat error', async () => {
        const mockReceiveChatNotificationEmail = await getMockReceiveChatNotificationEmail()

        mockGetNotificationWithDetails.mockResolvedValue(mockChatNotificationWithDetails);

        mockReceiveChatNotificationEmail.mockResolvedValue({
            success: false,
            error: CHAT_SEND_FAILED
        })

        const result = await processNotificationWebhook({ record: mockChatRecord as NotificationData });

        expect(result.success).toBe(false)
        expect(result.error).toBe(CHAT_SEND_FAILED);
    })

    // 処理失敗（record が null）
    it('should process notification webhook failed with record is null', async () => {
        const result = await processNotificationWebhook({ record: null as unknown as NotificationData });
        expect(result.success).toBe(false)
        expect(result.error).toBe(WEBHOOK_PROCESS_FAILED);
    })

    // 処理失敗（unknown の場合）
    it('should process notification webhook failed with unknown type', async () => {
        const mockUnknownNotificationRecord = {
            id: 'notification-3',
            type: 'unknown_type' as any,
            notifiable_id: 'unknown-1',
            notifiable_type: 'Unknown',
            created_at: new Date(),
            updated_at: new Date()
        };

        const mockNotificationWithDetails = {
            ...mockUnknownNotificationRecord,
            relatedData: null
        } as NotificationWithDetails;

        mockGetNotificationWithDetails.mockResolvedValue(mockNotificationWithDetails);

        const result = await processNotificationWebhook({ record: mockUnknownNotificationRecord });

        expect(mockGetNotificationWithDetails).toHaveBeenCalledWith(mockUnknownNotificationRecord);
        expect(result.success).toBe(true)
        expect(result.error).toBe(WEBHOOK_PROCESS_FAILED);
    })

    // 処理失敗（在庫通知メールで例外発生）
    it('should process notification webhook failed with stock notification email exception', async () => {
        mockGetNotificationWithDetails.mockResolvedValue(mockProductStockNotificationWithDetails);

        mockReceiveStockNotificationEmail.mockRejectedValue(
            new Error('Notification Email error')
        )

        const result = await processNotificationWebhook({ 
            record: mockProductStockRecord as NotificationData
        });

        expect(result.success).toBe(false)
        expect(result.error).toBe(STOCK_SEND_FAILED);
    })

    // 処理失敗（チャット通知メールで例外発生）
    it('should process notification webhook failed with chat notification email exception', async () => {
        mockGetNotificationWithDetails.mockResolvedValue(mockChatNotificationWithDetails);

        mockReceiveChatNotificationEmail.mockRejectedValue(
            new Error('Notification Email error')
        )

        const result = await processNotificationWebhook({ 
            record: mockChatRecord as NotificationData
        });

        expect(result.success).toBe(false)
        expect(result.error).toBe(CHAT_SEND_FAILED);
    })
})