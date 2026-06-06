import { NextRequest, NextResponse } from "next/server";

import { requireUser } from "@/lib/middleware/auth";
import { handleChatMessage } from "@/services/chat/hybrid-search";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

const { CHAT_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  await requireUser();

  const { message } = await request.json();

  if (!message) {
    return NextResponse.json(
      { success: false, message: CHAT_ERROR.MISSING_DATA },
      { status: 400 },
    );
  }

  try {
    const result = await handleChatMessage(message);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      source: result.source,
      isAutoReply: result.isAutoReply,
    });
  } catch (error) {
    console.error("API Error - Chat response generation failed:", error);

    return NextResponse.json(
      { success: false, message: CHAT_ERROR.SEND_FAILED },
      { status: 500 },
    );
  }
}
