import { describe, it, expect, vi, beforeEach } from "vitest"

import { createChatRoom, getUserChatRoomId } from "@/services/chat-room/actions"
import { mockChatRoom } from "@/__tests__/mocks/domain-mocks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHAT_ROOM_ERROR } = ERROR_MESSAGES;
const { CREATE_ROOM_FAILED } = CHAT_ROOM_ERROR;

const mockGetUserChatRoomId = vi.fn()
const mockCreateChatRoomWithTransaction = vi.fn()

vi.mock('@/repository/chatRoom', () => ({
    createChatRoomRepository: () => ({
        createChatRoomWithTransaction: mockCreateChatRoomWithTransaction,
    }),
    getChatRoomRepository: () => ({
        getUserChatRoomId: mockGetUserChatRoomId,
    }),
}))

/* ==================================== 
    Create Chat Room Test
==================================== */
describe('createChatRoom', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create chat room successfully', async () => {
        mockCreateChatRoomWithTransaction.mockResolvedValue(mockChatRoom)

        const result = await createChatRoom({ 
            tx: {} as unknown as TransactionClient,
            userId: 'test-user-id'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
        expect(result.data).toBeDefined()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateChatRoomWithTransaction.mockResolvedValue(null)

        const result = await createChatRoom({ 
            tx: {} as unknown as TransactionClient,
            userId: 'test-user-id'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_ROOM_FAILED)
        expect(result.data).toBeNull()
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockCreateChatRoomWithTransaction.mockRejectedValue(new Error('Database error'))

        const result = await createChatRoom({ 
            tx: {} as unknown as TransactionClient,
            userId: 'test-user-id'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_ROOM_FAILED)
        expect(result.data).toBeNull()
    })
})

/* ==================================== 
    Get User Chat Room Id Test
==================================== */
describe('getUserChatRoomId', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should return true when user has subscription', async () => {
        mockGetUserChatRoomId.mockResolvedValue(mockChatRoom.id)

        const result = await getUserChatRoomId({
            userId: 'user_test_123',
        })

        expect(result.data).toBe(mockChatRoom.id)
    })

    // 作成失敗
    it('should return null when repository returns null', async () => {
        mockGetUserChatRoomId.mockResolvedValue(null)

        const result = await getUserChatRoomId({
            userId: 'user_test_123',
        })

        expect(result.data).toBeNull()
    })
})