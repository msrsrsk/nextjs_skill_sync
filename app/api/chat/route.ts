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

    try {
        // メッセージの内容を取得
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

        try {
            // メッセージをデータベースに保存
            const { success, error, data } = await createChatMessageByUserId({
                userId: userId as UserId, 
                message, 
                senderType,
                source
            });
    
            if (!success) {
                if (error === CHAT_ERROR.MISSING_CHAT_ROOM) {
                    return NextResponse.json(
                        { message: error }, 
                        { status: 404 }
                    );
                }
                
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
            console.error('API Error - Create Chat Message error:', error);

            return NextResponse.json(
                { message: CHAT_ERROR.CREATE_FAILED }, 
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('API Error - Send Chat Message error:', error);

        return NextResponse.json(
            { message: CHAT_ERROR.MISSING_DATA }, 
            { status: 400 }
        );
    }
}