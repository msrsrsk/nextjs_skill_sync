import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/middleware/auth"
import { getUserChatRoomId } from "@/services/chat-room/actions"
import { createChatMessageByUserId } from "@/services/chat/actions"
import { CHAT_SENDER_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SENDER_USER } = CHAT_SENDER_TYPES;
const { CHAT_ERROR, CHAT_ROOM_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
    const { userId } = await requireUser();

    const { 
        message, 
        senderType = SENDER_USER,
        source,
    } = await request.json();

    if (!message) {
        return NextResponse.json(
            { message: CHAT_ERROR.MISSING_DATA }, 
            { status: 400 }
        )
    }

    try {
        const { data: chatRoom } = await getUserChatRoomId({ userId });

        if (!chatRoom) {
            return NextResponse.json(
                { message: CHAT_ROOM_ERROR.MISSING_CHAT_ROOM }, 
                { status: 404 }
            )
        }

        const { success, data, error } = await createChatMessageByUserId({
            chatRoomId: chatRoom.id,
            message,
            senderType,
            source
        });

        if (!success) {
            return NextResponse.json(
                { message: error }, 
                { status: 500 }
            )
        }

        return NextResponse.json({ 
            success: true, 
            data: data 
        })
    } catch (error) {
        console.error('Database : Error in getUserChatRoomId or createChatMessageByUserId: ', error);

        return NextResponse.json(
            { message: CHAT_ERROR.CREATE_FAILED }, 
            { status: 500 }
        )
    }
}