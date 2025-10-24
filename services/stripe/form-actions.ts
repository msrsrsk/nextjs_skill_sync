"use server"

import { actionAuth } from "@/lib/middleware/auth"
import { getUser } from "@/services/user/actions"
import { 
    getShippingAddressById, 
    updateStripeAndDefaultShippingAddress 
} from "@/services/shipping-address/actions"
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

    // 1. 住所IDの確認
    if (!newDefaultAddressId) {
        return {
            success: false, 
            error: SHIPPING_ADDRESS_ERROR.MISSING_ID,
            timestamp: Date.now()
        }
    }

    try {
        // throw new Error('お届け先として設定ができませんでした。\n時間をおいて再度お試しください。');

        // 2. ユーザー認証
        const authResult = await actionAuth(
            SHIPPING_ADDRESS_ERROR.UPDATE_DEFAULT_UNAUTHORIZED,
        );

        if (!authResult.success) {
            return {
                success: false,
                error: authResult.error as string,
                timestamp: Date.now()
            }
        }

        const { userId } = authResult;

        // 3. 住所の取得
        const newDefaultAddressResult = await getShippingAddressById({
            userId: userId as UserId,
            addressId: newDefaultAddressId as ShippingAddressId
        });

        if (!newDefaultAddressResult.data) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.INDIVIDUAL_FETCH_FAILED,
                timestamp: Date.now()
            }
        }

        // 4. Stripe顧客IDの取得
        const userResult = await getUser({
            userId: userId as UserId,
            getType: CUSTOMER_ID_DATA
        });

        if (!userResult) {
            return {
                success: false,
                error: USER_STRIPE_ERROR.CUSTOMER_ID_FETCH_FAILED,
                timestamp: Date.now()
            }
        }

        const customerId = userResult.user_stripes?.customer_id;

        // 5. 住所の更新
        if (customerId) {
            await updateStripeAndDefaultShippingAddress({
                id: newDefaultAddressId,
                userId: userId as UserId,
                customerId,
                shippingAddress: newDefaultAddressResult.data
            });
        }

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