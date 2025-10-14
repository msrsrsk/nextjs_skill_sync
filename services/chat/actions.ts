import { getChatRoomRepository } from "@/repository/chatRoom"
import { createChatRepository } from "@/repository/chat"
import { 
    CHAT_HISTORY_INITIAL_MESSAGE, 
    CHAT_SENDER_TYPES, 
    CHAT_SOURCE 
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SENDER_ADMIN } = CHAT_SENDER_TYPES;
const { HUMAN_SUPPORT } = CHAT_SOURCE;
const { CHAT_ERROR } = ERROR_MESSAGES;

interface CreateInitialChatProps {
    tx: TransactionClient;
    chatRoomId: ChatRoomId;
}

interface CreateChatMessageByUserIdProps extends ChatMessageProps {
    userId: UserId;
}

// 初期チャットメッセージの作成
export const createInitialChat = async ({ 
    tx,
    chatRoomId
}: CreateInitialChatProps) => {
    try {
        const repository = createChatRepository();
        await repository.createChatMessageWithTransaction({
            tx, 
            chatRoomId, 
            message: CHAT_HISTORY_INITIAL_MESSAGE, 
            senderType: SENDER_ADMIN as ChatSenderType,
            source: CHAT_SOURCE.INITIAL
        });

        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Database : Error in createInitialChat: ', error);

        return {
            success: false, 
            error: CHAT_ERROR.CREATE_INITIAL_FAILED,
            data: null
        }
    }
}

// チャットメッセージの追加
export const createChatMessageByUserId = async ({
    userId,
    message,
    senderType = SENDER_ADMIN as ChatSenderType,
    source = HUMAN_SUPPORT
}: CreateChatMessageByUserIdProps) => {
    try {
        const chatRoomRepository = getChatRoomRepository();
        const chatRoom = await chatRoomRepository.getUserChatRoomId({ userId });

        if (!chatRoom) {
            return {
                success: false, 
                error: CHAT_ERROR.MISSING_CHAT_ROOM,
                status: 404
            }
        }

        const chatRepository = createChatRepository();
        const chatMessage = await chatRepository.createChatMessage({
            chatRoomId: chatRoom.id,
            message,
            senderType,
            source
        });

        if (!chatMessage) {
            return {
                success: false, 
                error: CHAT_ERROR.CREATE_FAILED,
                status: 500
            }
        }

        return {
            success: true, 
            error: null, 
            data: chatMessage
        }
    } catch (error) {
        console.error('Database : Error in createChatMessageByUserId: ', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : CHAT_ERROR.CREATE_FAILED;

        return {
            success: false, 
            error: errorMessage,
            status: 500
        }
    }
}