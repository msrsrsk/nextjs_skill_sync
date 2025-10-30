import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    createInitialChat,
    createChatMessageByUserId
} from "@/services/chat/actions"
import { mockChatRoom, mockChatMessage } from "@/__tests__/mocks/domain-mocks"
import { CHAT_SENDER_TYPES, CHAT_SOURCE } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SENDER_USER, SENDER_ADMIN } = CHAT_SENDER_TYPES;
const { INITIAL, HUMAN_SUPPORT, RULE_BASED, EMBEDDING_SEARCH, STAFF_CONFIRMING, CHAT_USER } = CHAT_SOURCE;
const { CHAT_ERROR } = ERROR_MESSAGES;
const { CREATE_INITIAL_FAILED, CREATE_FAILED } = CHAT_ERROR;

const mockCreateChatMessageWithTransaction = vi.fn()
const mockCreateChatMessage = vi.fn()

vi.mock('@/repository/chat', () => ({
    createChatRepository: () => ({
        createChatMessageWithTransaction: mockCreateChatMessageWithTransaction,
        createChatMessage: mockCreateChatMessage,
    }),
}))

/* ==================================== 
    Create Initial Chat Test
==================================== */
describe('createInitialChat', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create initial chat successfully', async () => {
        mockCreateChatMessageWithTransaction.mockResolvedValue(mockChatRoom)

        const result = await createInitialChat({ 
            tx: {} as unknown as TransactionClient,
            chatRoomId: 'test-chat-room-id'
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateChatMessageWithTransaction.mockResolvedValue(null)

        const result = await createInitialChat({ 
            tx: {} as unknown as TransactionClient,
            chatRoomId: 'test-chat-room-id'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_INITIAL_FAILED)
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockCreateChatMessageWithTransaction.mockRejectedValue(new Error('Database error'))

        const result = await createInitialChat({ 
            tx: {} as unknown as TransactionClient,
            chatRoomId: 'test-chat-room-id'
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_INITIAL_FAILED)
    })
})

/* ==================================== 
    Create Chat Message By User Id Test
==================================== */
describe('createChatMessageByUserId', () => {
    beforeEach(async () => {
        vi.clearAllMocks()
    })

    // 作成成功
    it('should create chat message by user id successfully', async () => {
        mockCreateChatMessage.mockResolvedValue(mockChatMessage)

        const result = await createChatMessageByUserId(mockChatMessage)

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成成功（senderType が user の場合）
    it('should create chat message by user id successfully when senderType is user', async () => {
        mockCreateChatMessage.mockResolvedValue(mockChatMessage)

        const result = await createChatMessageByUserId({
            ...mockChatMessage,
            senderType: SENDER_USER as ChatSenderType,
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成成功（senderType が admin の場合）
    it('should create chat message by user id successfully when senderType is admin', async () => {
        mockCreateChatMessage.mockResolvedValue(mockChatMessage)

        const result = await createChatMessageByUserId({
            ...mockChatMessage,
            senderType: SENDER_ADMIN as ChatSenderType,
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成成功（source が human_support の場合）
    it('should create chat message by user id successfully when source is human_support', async () => {
        mockCreateChatMessage.mockResolvedValue(mockChatMessage)

        const result = await createChatMessageByUserId({
            ...mockChatMessage,
            source: HUMAN_SUPPORT as ChatSource,
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成成功（source が rule_based の場合）
    it('should create chat message by user id successfully when source is rule_based', async () => {
        mockCreateChatMessage.mockResolvedValue(mockChatMessage)

        const result = await createChatMessageByUserId({
            ...mockChatMessage,
            source: RULE_BASED as ChatSource,
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成成功（source が embedding_search の場合）
    it('should create chat message by user id successfully when source is embedding_search', async () => {
        mockCreateChatMessage.mockResolvedValue(mockChatMessage)

        const result = await createChatMessageByUserId({
            ...mockChatMessage,
            source: EMBEDDING_SEARCH as ChatSource,
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成成功（source が staff_confirming の場合）
    it('should create chat message by user id successfully when source is staff_confirming', async () => {
        mockCreateChatMessage.mockResolvedValue(mockChatMessage)

        const result = await createChatMessageByUserId({
            ...mockChatMessage,
            source: STAFF_CONFIRMING as ChatSource,
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成成功（source が chat_user の場合）
    it('should create chat message by user id successfully when source is chat_user', async () => {
        mockCreateChatMessage.mockResolvedValue(mockChatMessage)

        const result = await createChatMessageByUserId({
            ...mockChatMessage,
            source: CHAT_USER as ChatSource,
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成成功（source が initial の場合）
    it('should create chat message by user id successfully when source is initial', async () => {
        mockCreateChatMessage.mockResolvedValue(mockChatMessage)

        const result = await createChatMessageByUserId({
            ...mockChatMessage,
            source: INITIAL as ChatSource,
        })

        expect(result.success).toBe(true)
        expect(result.error).toBeNull()
    })

    // 作成失敗
    it('should return failure when repository fails', async () => {
        mockCreateChatMessage.mockResolvedValue(null)

        const result = await createChatMessageByUserId(mockChatMessage)

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
    })

    // 作成失敗（例外発生）
    it('should return failure when exception occurs', async () => {
        mockCreateChatMessage.mockRejectedValue(new Error('Database error'))

        const result = await createChatMessageByUserId(mockChatMessage)

        expect(result.success).toBe(false)
        expect(result.error).toBe(CREATE_FAILED)
    })
})