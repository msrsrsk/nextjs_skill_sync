import { NextRequest, NextResponse } from "next/server"

import { requireApiAuth } from "@/lib/middleware/auth"
import { deleteUser } from "@/lib/services/user/actions"
import { deleteUserImage } from "@/lib/services/cloudflare/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { USER_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest) {
    try {
        // throw new Error('test error');

        const { userId } = await requireApiAuth(
            request, 
            USER_ERROR.UNAUTHORIZED
        )

        // ユーザーのアイコン画像をストレージから削除
        const { 
            success: deleteUserImageSuccess, 
            error: deleteUserImageError 
        } = await deleteUserImage({ userId: userId as UserId });

        if (!deleteUserImageSuccess) {
            return NextResponse.json(
                { message: deleteUserImageError }, 
                { status: 500 }
            );
        }

        // ユーザーを削除
        const { 
            success: deleteUserSuccess, 
            error: deleteUserError 
        } = await deleteUser({ userId: userId as UserId });

        if (!deleteUserSuccess) {
            return NextResponse.json(
                { message: deleteUserError }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error - User DELETE error:', error);

        return NextResponse.json(
            { message: USER_ERROR.DELETE_FAILED }, 
            { status: 500 }
        );
    }
}