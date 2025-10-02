import prisma from "@/lib/database/prisma/client"

interface CreateChatRoomWithTransactionProps {
    tx: TransactionClient;
    userId: UserId;
}

export const createChatRoomRepository = () => {
    return {
        // チャットルームの作成（初期設定）
        createChatRoomWithTransaction: async ({
            tx,
            userId
        }: CreateChatRoomWithTransactionProps) => {
            return await tx.chatRoom.create({
                data: { 
                    user_id: userId 
                }
            })
        }
    }
}

export const getChatRoomRepository = () => {
    return {
        // チャットルームIDの取得
        getUserChatRoomId: async ({ userId }: UserIdProps) => {
            return await prisma.chatRoom.findUnique({
                where: { user_id: userId },
                select: { id: true }
            })
        },
        // チャット履歴の取得
        getChatRoom: async ({ userId }: UserIdProps) => {
            return await prisma.chatRoom.findUnique({
                where: { user_id: userId },
                select: {
                    chats: {
                        select: {
                            id: true,
                            message: true,
                            sent_at: true,
                            sender_type: true,
                            source: true
                        },
                        orderBy: { sent_at: 'asc' }
                    },
                    user: {
                        select: { icon_url: true }
                    }
                }
            })
        }
    }
}