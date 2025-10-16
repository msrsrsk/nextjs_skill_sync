import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/middleware/auth"
import { deleteUserAccount } from "@/services/user/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

export async function DELETE(request: NextRequest) {
    const { userId } = await requireUser();

    try {
        const result = await deleteUserAccount({ userId });
    
        if (!result.success) {
            return NextResponse.json(
                { message: result.error }, 
                { status: 500 }
            )
        }
    
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database : Error in deleteUserAccount:', error);

        return NextResponse.json(
            { message: USER_ERROR.DELETE_FAILED }, 
            { status: 500 }
        )
    }
}