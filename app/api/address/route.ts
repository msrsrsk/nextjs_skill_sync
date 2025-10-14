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
        )
    }

    const result = await deleteShippingAddress({ id: addressId });

    if (!result.success) {
        return NextResponse.json(
            { message: result.error }, 
            { status: result.status }
        )
    }

    return NextResponse.json({ success: true })
}