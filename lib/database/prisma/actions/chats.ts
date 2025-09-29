import prisma from "@/lib/database/prisma/client"

interface CreateChatRoomWithTransactionProps {
    tx: TransactionClient;
    userId: UserId;
}

interface CreateChatMessageWithTransactionProps extends ChatActionsProps {
    tx: TransactionClient;
    chatRoomId: ChatRoomId;
}

interface CreateChatMessageDataProps extends ChatActionsProps {
    chatRoomId: ChatRoomId;
}

// チャットルームの作成（初期設定）
export const createChatRoomWithTransaction = async ({
    tx,
    userId
}: CreateChatRoomWithTransactionProps) => {
    return await tx.chatRoom.create({
        data: { 
            user_id: userId 
        }
    })
}

// チャットメッセージの作成（初期設定）
export const createChatMessageWithTransaction = async ({
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
}

// チャットメッセージの作成
export const createChatMessageData = async ({
    chatRoomId,
    message,
    senderType,
    source
}: CreateChatMessageDataProps) => {
    return await prisma.chat.create({
        data: {
            chat_room_id: chatRoomId,
            message,
            sender_type: senderType,
            source
        }
    });
}

// チャットルームIDの取得
export const getChatRoomIdByUserIdData = async ({ userId }: { userId: UserId }) => {
    return await prisma.chatRoom.findUnique({
        where: { user_id: userId },
        select: { id: true }
    });
}

// チャット履歴の取得
export const getChatRoomData = async ({ userId }: { userId: UserId }) => {
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