import { NextRequest, NextResponse } from "next/server"

import { deleteShippingAddress } from "@/services/shipping-address/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SHIPPING_ADDRESS_ERROR } = ERROR_MESSAGES;

export const dynamic = "force-dynamic"

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('addressId');

    if (!addressId) {
        return NextResponse.json(
            { message: SHIPPING_ADDRESS_ERROR.DELETE_MISSING_DATA }, 
            { status: 400 }
        );
    }

    try {
        // throw new Error('test');
        
        const { success, error } = await deleteShippingAddress({
            id: addressId
        });

        if (!success) {
            return NextResponse.json(
                { message: error }, 
                { status: 404 }
            );
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error - Delete Shipping Address error:', error);

        return NextResponse.json(
            { message: SHIPPING_ADDRESS_ERROR.DELETE_FAILED }, 
            { status: 500 }
        );
    }
}