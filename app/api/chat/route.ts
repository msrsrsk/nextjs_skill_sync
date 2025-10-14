import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/middleware/auth"
import { createChatMessageByUserId } from "@/services/chat/actions"
import { CHAT_SENDER_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SENDER_USER } = CHAT_SENDER_TYPES;
const { CHAT_ERROR } = ERROR_MESSAGES;

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

    const result = await createChatMessageByUserId({
        userId,
        message,
        senderType,
        source
    });
    
    if (!result.success) {
        return NextResponse.json(
            { message: result.error }, 
            { status: result.status }
        )
    }

    return NextResponse.json({ 
        success: true, 
        data: result.data 
    })
}