import { NextRequest, NextResponse } from "next/server"

import { requireUserId } from "@/lib/middleware/auth"
import { createChatMessageByUserId } from "@/lib/services/chat/actions"
import { CHAT_SENDER_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SENDER_USER } = CHAT_SENDER_TYPES;
const { CHAT_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
    try {
        const { userId } = await requireUserId();

        const { 
            message, 
            senderType = SENDER_USER,
            source,
        } = await request.json();

        if (!message) {
            return NextResponse.json(
                { message: CHAT_ERROR.MISSING_DATA }, 
                { status: 400 }
            );
        }
        
        const { success, error, data } = await createChatMessageByUserId({
            userId: userId as UserId, 
            message, 
            senderType,
            source
        });

        if (!success) {
            return NextResponse.json(
                { message: error }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            data: data 
        });
    } catch (error) {
        console.error('API Error - Chat POST error:', error);

        return NextResponse.json(
            { message: CHAT_ERROR.SEND_FAILED }, 
            { status: 500 }
        );
    }
}