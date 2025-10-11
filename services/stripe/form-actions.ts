"use server"

import { actionAuth } from "@/lib/middleware/auth"
import { getShippingAddressRepository } from "@/repository/shippingAddress"
import { getUser } from "@/services/user/actions"
import { updateStripeAndDefaultShippingAddress } from "@/services/shipping-address/actions"
import { GET_USER_DATA_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CUSTOMER_ID_DATA } = GET_USER_DATA_TYPES;
const { 
    SHIPPING_ADDRESS_ERROR, 
    USER_STRIPE_ERROR 
} = ERROR_MESSAGES;

export async function setDefaultShippingAddressAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionStateWithTimestamp> {

    const newDefaultAddressId = formData.get('newDefaultAddressId') as ShippingAddressId;

    try {
        // throw new Error('お届け先として設定ができませんでした。\n時間をおいて再度お試しください。');

        // 1. 住所IDの確認
        if (!newDefaultAddressId) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.MISSING_ID,
                timestamp: Date.now()
            }
        }

        const shippingAddressRepository = getShippingAddressRepository();
        const newDefaultAddressResult = await shippingAddressRepository.getShippingAddressById({
            addressId: newDefaultAddressId
        });

        if (!newDefaultAddressResult) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.INDIVIDUAL_FETCH_FAILED,
                timestamp: Date.now()
            }
        }

        // 2. ユーザー認証 & Stripe顧客IDの取得
        const { userId } = await actionAuth(
            SHIPPING_ADDRESS_ERROR.UPDATE_DEFAULT_UNAUTHORIZED,
        );

        const userResult = await getUser({
            userId: userId as UserId,
            getType: CUSTOMER_ID_DATA,
            errorMessage: USER_STRIPE_ERROR.CUSTOMER_ID_FETCH_FAILED
        });

        const customerId = userResult.user_stripes?.customer_id;

        // 3. 住所の更新
        await updateStripeAndDefaultShippingAddress({
            id: newDefaultAddressId,
            customerId,
            shippingAddress: newDefaultAddressResult
        });

        return {
            success: true, 
            error: null, 
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Set Default Shipping Address error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : SHIPPING_ADDRESS_ERROR.SET_DEFAULT_FAILED;

        return {
            success: false, 
            error: errorMessage,
            timestamp: Date.now()
        }
    }
}