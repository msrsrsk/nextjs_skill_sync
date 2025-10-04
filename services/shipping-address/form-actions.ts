"use server"

import { actionAuth } from "@/lib/middleware/auth"
import { createShippingAddress, updateShippingAddress } from "@/services/shipping-address/actions"
import { getUserRepository } from "@/repository/user"
import { updateCustomerShippingAddress } from "@/services/stripe/actions"
import { GET_USER_DATA_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CUSTOMER_ID_DATA } = GET_USER_DATA_TYPES;
const { SHIPPING_ADDRESS_ERROR, USER_ERROR } = ERROR_MESSAGES;

interface ShippingAddressActionState extends ActionStateWithTimestamp {
    data: ShippingAddress | null;
}

export async function createShippingAddressAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData
): Promise<ShippingAddressActionState> {
    try {
        // throw new Error('住所の登録に失敗しました。\n時間をおいて再度お試しください。');

        const { userId } = await actionAuth<ShippingAddress>(
            SHIPPING_ADDRESS_ERROR.ADD_UNAUTHORIZED,
            true
        );
    
        const name = formData.get('name');
        const postal_code = formData.get('postal_code');
        const state = formData.get('state');
        const address_line1 = formData.get('address_line1');
        const address_line2 = formData.get('address_line2');

        const shippingAddressData = { 
            user_id: userId,
            name, 
            postal_code, 
            state, 
            address_line1, 
            address_line2, 
            is_default: false,
        } as ShippingAddress;

        const { success, error, data } = await createShippingAddress({
            address: shippingAddressData
        });

        if (!success) {
            return {
                success: false, 
                error: error,
                data: null,
                timestamp: Date.now()
            }
        }

        return {
            success: true, 
            error: null, 
            data,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Create Shipping Address error:', error);
        
        return {
            success: false, 
            error: SHIPPING_ADDRESS_ERROR.RESIST_FAILED,
            data: null,
            timestamp: Date.now()
        }
    }
}

export async function updateShippingAddressAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData
): Promise<ShippingAddressActionState> {
    try {
        // throw new Error('住所の更新に失敗しました。\n時間をおいて再度お試しください。');
        const { userId } = await actionAuth<ShippingAddress>(
            SHIPPING_ADDRESS_ERROR.UPDATE_UNAUTHORIZED,
            true
        );
    
        const id = formData.get('id') as ShippingAddressId;
        const name = formData.get('name');
        const postal_code = formData.get('postal_code');
        const state = formData.get('state');
        const address_line1 = formData.get('address_line1');
        const address_line2 = formData.get('address_line2');
    
        if (!id) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.MISSING_ID,
                data: null,
                timestamp: Date.now()
            }
        }

        const shippingAddressData = { 
            user_id: userId,
            name, 
            postal_code, 
            state, 
            address_line1, 
            address_line2, 
            is_default: false,
        } as ShippingAddress;

        const { success, error, data } = await updateShippingAddress({
            id,
            shippingAddress: shippingAddressData
        });

        if (!success) {
            return {
                success: false, 
                error: error,
                data: null,
                timestamp: Date.now()
            }
        }

        return {
            success: true, 
            error: null, 
            data,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Update Shipping Address error:', error);
        
        return {
            success: false, 
            error: SHIPPING_ADDRESS_ERROR.UPDATE_FAILED,
            data: null,
            timestamp: Date.now()
        }
    }
}

export async function updateDefaultShippingAddressAction(
    prevState: ActionStateWithTimestamp,
    formData: FormData
): Promise<ShippingAddressActionState> {
    try {
        // throw new Error('お届け先の住所の更新に失敗しました。\n時間をおいて再度お試しください。');
        
        const { userId } = await actionAuth<ShippingAddress>(
            SHIPPING_ADDRESS_ERROR.UPDATE_UNAUTHORIZED,
            true
        );
    
        if (!userId) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.UPDATE_UNAUTHORIZED,
                data: null,
                timestamp: Date.now()
            }
        }
    
        const id = formData.get('id') as ShippingAddressId;
        const name = formData.get('name');
        const postal_code = formData.get('postal_code');
        const state = formData.get('state');
        const address_line1 = formData.get('address_line1');
        const address_line2 = formData.get('address_line2');
    
        if (!id) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.MISSING_ID,
                data: null,
                timestamp: Date.now()
            }
        }

        const repository = getUserRepository();
        const user = await repository.getUser({
            userId,
            getType: CUSTOMER_ID_DATA
        });

        if (!user) {
            return {
                success: false, 
                error: USER_ERROR.CUSTOMER_ID_FETCH_FAILED,
                data: null,
                timestamp: Date.now()
            }
        }

        const customerId = user.user_stripes?.customer_id;

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

        const [stripeResult, setDefaultAddressResult] = await Promise.all([
            customerId ? updateCustomerShippingAddress(
                customerId,
                {
                    address: {
                        line1: shippingAddress.address_line1,
                        line2: shippingAddress.address_line2 || '',
                        city: shippingAddress.city || '',
                        state: shippingAddress.state,
                        postal_code: shippingAddress.postal_code
                    },
                    name: shippingAddress.name,
                }
            ) : Promise.resolve({ 
                success: true, 
                error: null, 
                data: null 
            }),
            updateShippingAddress({
                id,
                shippingAddress
            })
        ]);

        if (!stripeResult.success) {
            return {
                success: false, 
                error: stripeResult.error,
                data: null,
                timestamp: Date.now()
            }
        }

        if (!setDefaultAddressResult.success) {
            return {
                success: false, 
                error: setDefaultAddressResult.error,
                data: null,
                timestamp: Date.now()
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
        
        return {
            success: false, 
            error: SHIPPING_ADDRESS_ERROR.UPDATE_DEFAULT_FAILED,
            data: null,
            timestamp: Date.now()
        }
    }
}