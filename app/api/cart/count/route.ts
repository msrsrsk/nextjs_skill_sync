import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/middleware";

import { getCartItemRepository } from "@/repository/cartItem";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

const { CART_ITEM_ERROR } = ERROR_MESSAGES;

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id as UserId | undefined;

  if (!userId) {
    return NextResponse.json({ success: true, data: { count: 0 } });
  }

  try {
    const count = await getCartItemRepository().getCartCount({ userId });

    return NextResponse.json({ success: true, data: { count } });
  } catch (error) {
    console.error("Cart API : Error in getCartCount:", error);

    return NextResponse.json(
      { message: CART_ITEM_ERROR.FETCH_FAILED },
      { status: 500 },
    );
  }
}
