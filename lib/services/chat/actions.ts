import { getChatRoomRepository } from "@/repository/chatRoom"
import { createChatRepository } from "@/repository/chat"
import { CHAT_SENDER_TYPES, CHAT_SOURCE } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SENDER_ADMIN } = CHAT_SENDER_TYPES;
const { HUMAN_SUPPORT } = CHAT_SOURCE;
const { CHAT_ERROR } = ERROR_MESSAGES;

interface CreateChatMessageByUserIdProps extends ChatMessageProps {
    userId: UserId;
}

// チャットメッセージの追加（個別ユーザーに応じて）
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
                error: CHAT_ERROR.MISSING_CHAT_ROOM
            }
        }

        const chatRepository = createChatRepository();
        const chatMessage = await chatRepository.createChatMessage({
            chatRoomId: chatRoom.id,
            message,
            senderType,
            source
        });

        return {
            success: true, 
            error: null, 
            data: chatMessage
        }
    } catch (error) {
        console.error('Database : Error in createChatMessageByUserId: ', error);

        return {
            success: false, 
            error: CHAT_ERROR.CREATE_FAILED
        }
    }
}