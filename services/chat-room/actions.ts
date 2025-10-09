import { createChatRoomRepository } from "@/repository/chatRoom"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CHAT_ROOM_ERROR } = ERROR_MESSAGES;

// チャットルームの作成
export const createChatRoom = async ({ 
    tx,
    userId
}: CreateChatRoomWithTransactionProps) => {
    try {
        const repository = createChatRoomRepository();
        const chatRoom = await repository.createChatRoomWithTransaction({
            tx, 
            userId
        });

        return {
            success: true, 
            error: null,
            data: chatRoom
        }
    } catch (error) {
        console.error('Database : Error in createChatRoom: ', error);

        return {
            success: false, 
            error: CHAT_ROOM_ERROR.CREATE_ROOM_FAILED,
        }
    }
}