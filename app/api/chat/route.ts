import { NextRequest, NextResponse } from "next/server"

import { requireApiAuth } from "@/lib/middleware/auth"
import { createChatMessageByUserId } from "@/lib/services/chat/actions"
import { CHAT_SENDER_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SENDER_USER } = CHAT_SENDER_TYPES;
const { CHAT_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
    try {
        const { userId } = await requireApiAuth(
            request, 
            CHAT_ERROR.UNAUTHORIZED
        );

        console.log('userId', userId);

        const { 
            message, 
            senderType = SENDER_USER,
            source,
        } = await request.json();

        console.log('message', message);
        console.log('senderType', senderType);
        console.log('source', source);

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

        console.log('success', success);
        console.log('error', error);
        console.log('data', data);

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