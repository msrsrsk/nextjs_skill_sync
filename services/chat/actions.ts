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
    chatRoomId: ChatRoomId;
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
    chatRoomId,
    message,
    senderType = SENDER_ADMIN as ChatSenderType,
    source = HUMAN_SUPPORT
}: CreateChatMessageByUserIdProps) => {
    const chatRepository = createChatRepository();
    const result = await chatRepository.createChatMessage({
        chatRoomId,
        message,
        senderType,
        source
    });

    return {
        success: !!result, 
        data: result
    }
}