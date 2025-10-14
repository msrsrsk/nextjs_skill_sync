import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/middleware/auth"
import { deleteUserAccount } from "@/services/user/actions"

export const dynamic = "force-dynamic"

export async function DELETE(request: NextRequest) {
    const { userId } = await requireUser();

    const result = await deleteUserAccount({ userId });

    if (!result.success) {
        return NextResponse.json(
            { message: result.error }, 
            { status: result.status }
        )
    }

    return NextResponse.json({ success: true });
}