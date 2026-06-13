import { NextResponse } from "next/server";

import { getProductRepository } from "@/repository/product";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

const { PRODUCT_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data } = await getProductRepository().getProductPriceBounds();

    if (!data) {
      return NextResponse.json(
        { message: PRODUCT_ERROR.PRICE_FETCH_FAILED },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Product API : Error in getProductPriceBounds:", error);

    return NextResponse.json(
      { message: PRODUCT_ERROR.PRICE_FETCH_FAILED },
      { status: 500 },
    );
  }
}
