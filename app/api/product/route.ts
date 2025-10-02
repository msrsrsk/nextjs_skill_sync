import { NextResponse } from "next/server"

import { getProductRepository } from "@/repository/product"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.getAll('id');
    const pageType = searchParams.get('pageType');

    if (!ids || ids.length === 0) {
        return NextResponse.json(
            { message: PRODUCT_ERROR.NO_IDS }, 
            { status: 400 }
        );
    }

    try {
        const repository = getProductRepository();
        const productsResult = await repository.getProductsByIds({
            ids,
            pageType
        });

        return NextResponse.json({ 
            success: true, 
            data: productsResult || []
        });
    } catch (error) {
        console.error('API Error - Get Products error:', error);

        return NextResponse.json(
            { message: PRODUCT_ERROR.FETCH_FAILED }, 
            { status: 500 }
        );
    }
}