import { NextResponse } from "next/server"

import { getProductsByIdsData } from "@/lib/database/prisma/actions/products"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    const pageType = searchParams.get('pageType');

    if (!idsParam) {
        return NextResponse.json(
            { message: PRODUCT_ERROR.NO_IDS }, 
            { status: 400 }
        );
    }

    try {
        const ids = idsParam.split(',').filter(id => id.trim() !== '');

        if (ids.length === 0) {
            return NextResponse.json(
                { message: PRODUCT_ERROR.NOT_FOUND_IDS }, 
                { status: 400 }
            );
        }

        const productsResult = await getProductsByIdsData({
            ids,
            pageType
        });

        if (!productsResult) {
            return NextResponse.json(
                { message: PRODUCT_ERROR.IDS_FETCH_FAILED }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            data: productsResult 
        });
    } catch (error) {
        console.error('API Error - Products GET error:', error);

        return NextResponse.json(
            { message: PRODUCT_ERROR.FETCH_FAILED }, 
            { status: 500 }
        );
    }
}