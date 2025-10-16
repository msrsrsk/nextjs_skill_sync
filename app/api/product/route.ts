import { NextResponse } from "next/server"

import { getProductsByIds } from "@/services/product/actions"
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
        const { data } = await getProductsByIds({
            ids,
            pageType: pageType as GetProductsPageType
        });
    
        return NextResponse.json({
            success: true,
            data: data
        })
    } catch (error) {
        console.error('Database : Error in getProductsByIds:', error);

        return NextResponse.json(
            { message: PRODUCT_ERROR.FETCH_FAILED }, 
            { status: 500 }
        )
    }
}