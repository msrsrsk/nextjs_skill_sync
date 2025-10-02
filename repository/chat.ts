import prisma from "@/lib/clients/prisma/client"

interface CreateChatMessageWithTransactionProps extends ChatMessageProps {
    tx: TransactionClient;
    chatRoomId: ChatRoomId;
}

interface CreateChatMessageProps extends ChatMessageProps {
    chatRoomId: ChatRoomId;
}

export const createChatRepository = () => {
    return {
        // チャットメッセージの作成（初期設定）
        createChatMessageWithTransaction: async ({
            tx,
            chatRoomId,
            message,
            senderType,
            source
        }: CreateChatMessageWithTransactionProps) => {
            return await tx.chat.create({
                data: {
                    chat_room_id: chatRoomId,
                    message,
                    sender_type: senderType,
                    source
                }
            })
        },
        // チャットメッセージの作成
        createChatMessage: async ({
            chatRoomId,
            message,
            senderType,
            source
        }: CreateChatMessageProps) => {
            return await prisma.chat.create({
                data: {
                    chat_room_id: chatRoomId,
                    message,
                    sender_type: senderType,
                    source
                }
            })
        }
    }
}