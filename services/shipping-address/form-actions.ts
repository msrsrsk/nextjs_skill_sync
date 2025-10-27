"use server"

import { actionAuth } from "@/lib/middleware/auth"
import { 
    createShippingAddress, 
    updateShippingAddress, 
    updateStripeAndShippingAddress 
} from "@/services/shipping-address/actions"
import { getUser } from "@/services/user/actions"
import { GET_USER_DATA_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CUSTOMER_ID_DATA } = GET_USER_DATA_TYPES;
const { SHIPPING_ADDRESS_ERROR, USER_STRIPE_ERROR } = ERROR_MESSAGES;

interface ShippingAddressActionState extends ActionStateWithTimestamp {
    data: ShippingAddress | null;
}

export async function createShippingAddressAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData
): Promise<ShippingAddressActionState> {

    const name = formData.get('name');
    const postal_code = formData.get('postal_code');
    const state = formData.get('state');
    const address_line1 = formData.get('address_line1');
    const address_line2 = formData.get('address_line2');

    try {
        // throw new Error('住所の登録に失敗しました。\n時間をおいて再度お試しください。');
        const authResult = await actionAuth<ShippingAddress>(
            SHIPPING_ADDRESS_ERROR.ADD_UNAUTHORIZED,
            true
        );

        if (!authResult.success) {
            return {
                success: false,
                error: authResult.error as string,
                data: null,
                timestamp: Date.now()
            }
        }

        const { userId } = authResult;

        const shippingAddressData = { 
            user_id: userId,
            name, 
            postal_code, 
            state, 
            address_line1, 
            address_line2, 
            is_default: false,
        } as ShippingAddress;

        const result = await createShippingAddress({
            address: shippingAddressData
        });

        if (!result.success) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.CREATE_FAILED,
                data: null,
                timestamp: Date.now()
            }
        }

        return {
            success: true, 
            error: null, 
            data: result.data,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Create Shipping Address error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : SHIPPING_ADDRESS_ERROR.RESIST_FAILED;
        
        return {
            success: false, 
            error: errorMessage,
            data: null,
            timestamp: Date.now()
        }
    }
}

export async function updateShippingAddressAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData
): Promise<ShippingAddressActionState> {

    const id = formData.get('id') as ShippingAddressId;
    const name = formData.get('name');
    const postal_code = formData.get('postal_code');
    const state = formData.get('state');
    const address_line1 = formData.get('address_line1');
    const address_line2 = formData.get('address_line2');

    try {
        // throw new Error('住所の更新に失敗しました。\n時間をおいて再度お試しください。');
        if (!id) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.MISSING_ID,
                data: null,
                timestamp: Date.now()
            }
        }

        const authResult = await actionAuth<ShippingAddress>(
            SHIPPING_ADDRESS_ERROR.UPDATE_UNAUTHORIZED,
            true
        );

        if (!authResult.success) {
            return {
                success: false,
                error: authResult.error as string,
                data: null,
                timestamp: Date.now()
            }
        }

        const { userId } = authResult;

        const shippingAddressData = { 
            user_id: userId,
            name, 
            postal_code, 
            state, 
            address_line1, 
            address_line2, 
            is_default: false,
        } as ShippingAddress;

        const result = await updateShippingAddress({
            id,
            userId: userId as UserId,
            shippingAddress: shippingAddressData
        });

        if (!result.success) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.UPDATE_FAILED,
                data: null,
                timestamp: Date.now()
            }
        }

        return {
            success: true, 
            error: null, 
            data: result.data,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Update Shipping Address error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : SHIPPING_ADDRESS_ERROR.UPDATE_FAILED;
        
        return {
            success: false, 
            error: errorMessage,
            data: null,
            timestamp: Date.now()
        }
    }
}

export async function updateDefaultShippingAddressAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData
): Promise<ShippingAddressActionState> {

    const id = formData.get('id') as ShippingAddressId;
    const name = formData.get('name');
    const postal_code = formData.get('postal_code');
    const state = formData.get('state');
    const address_line1 = formData.get('address_line1');
    const address_line2 = formData.get('address_line2');

    try {
        // throw new Error('お届け先の住所の更新に失敗しました。\n時間をおいて再度お試しください。');

        // 1. 住所IDの確認
        if (!id) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.MISSING_ID,
                data: null,
                timestamp: Date.now()
            }
        }

        // 2. ユーザー認証 & Stripe顧客IDの取得
        const authResult = await actionAuth<ShippingAddress>(
            SHIPPING_ADDRESS_ERROR.UPDATE_UNAUTHORIZED,
            true
        );

        if (!authResult.success) {
            return {
                success: false,
                error: authResult.error as string,
                data: null,
                timestamp: Date.now()
            }
        }

        const { userId } = authResult;

        const user = await getUser({
            userId: userId as UserId,
            getType: CUSTOMER_ID_DATA
        });

        if (!user) {
            return {
                success: false,
                error: USER_STRIPE_ERROR.CUSTOMER_ID_FETCH_FAILED,
                data: null,
                timestamp: Date.now()
            }
        }

        const customerId = user.user_stripes?.customer_id;

        // 3. 住所の更新
        const shippingAddress = { 
            id,
            user_id: userId,
            name, 
            postal_code, 
            state, 
            address_line1, 
            address_line2, 
            is_default: true,
        } as ShippingAddress;

        if (customerId) {
            const result = await updateStripeAndShippingAddress({
                id,
                userId: userId as UserId,
                customerId,
                shippingAddress
            });

            if (!result.success) {
                return {
                    success: false, 
                    error: result.error as string,
                    data: null,
                    timestamp: Date.now()
                }
            }
        }

        return {
            success: true, 
            error: null, 
            data: shippingAddress,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Update Default Shipping Address error:', error);

        const errorMessage = error instanceof Error 
            ? error.message 
            : SHIPPING_ADDRESS_ERROR.UPDATE_DEFAULT_FAILED;
        
        return {
            success: false, 
            error: errorMessage,
            data: null,
            timestamp: Date.now()
        }
    }
}