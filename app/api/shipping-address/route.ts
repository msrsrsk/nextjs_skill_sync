import { NextRequest, NextResponse } from "next/server"

import { requireApiAuth } from "@/lib/middleware/auth"
import { deleteShippingAddress } from "@/lib/services/shipping-address/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SHIPPING_ADDRESS_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic";

export async function DELETE(request: NextRequest) {
    try {
        // throw new Error('test');

        await requireApiAuth(
            request, 
            SHIPPING_ADDRESS_ERROR.DELETE_UNAUTHORIZED
        );

        const { searchParams } = new URL(request.url);
        const addressId = searchParams.get('addressId');

        if (!addressId) {
            return NextResponse.json(
                { message: SHIPPING_ADDRESS_ERROR.DELETE_MISSING_DATA }, 
                { status: 400 }
            );
        }
        
        const { success, error } = await deleteShippingAddress({
            id: addressId
        });

        if (!success) {
            return NextResponse.json(
                { message: error }, 
                { status: 500 }
            );
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error - Shipping Address DELETE error:', error);

        return NextResponse.json(
            { message: SHIPPING_ADDRESS_ERROR.DELETE_FAILED }, 
            { status: 500 }
        );
    }
}