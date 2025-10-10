"use server"

import { actionAuth } from "@/lib/middleware/auth"
import { getShippingAddressRepository } from "@/repository/shippingAddress"
import { getUser } from "@/services/user/actions"
import { setDefaultShippingAddress } from "@/services/shipping-address/actions"
import { updateCustomerShippingAddress } from "@/services/stripe/actions"
import { GET_USER_DATA_TYPES } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CUSTOMER_ID_DATA } = GET_USER_DATA_TYPES;
const { 
    SHIPPING_ADDRESS_ERROR, 
    USER_ERROR 
} = ERROR_MESSAGES;

export async function setDefaultShippingAddressAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionStateWithTimestamp> {
    try {
        // throw new Error('お届け先として設定ができませんでした。\n時間をおいて再度お試しください。');

        const { userId } = await actionAuth(
            SHIPPING_ADDRESS_ERROR.UPDATE_DEFAULT_UNAUTHORIZED,
        );
    
        const newDefaultAddressId = formData.get('newDefaultAddressId') as ShippingAddressId;
    
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

        const userResult = await getUser({
            userId: userId as UserId,
            getType: CUSTOMER_ID_DATA,
            errorMessage: USER_ERROR.CUSTOMER_ID_FETCH_FAILED
        });

        const customerId = userResult.user_stripes?.customer_id;

        const [stripeResult, setDefaultAddressResult] = await Promise.all([
            customerId ? updateCustomerShippingAddress(
                customerId,
                {
                    address: {
                        line1: newDefaultAddressResult.address_line1,
                        line2: newDefaultAddressResult.address_line2 || '',
                        city: newDefaultAddressResult.city || '',
                        state: newDefaultAddressResult.state,
                        postal_code: newDefaultAddressResult.postal_code
                    },
                    name: newDefaultAddressResult.name,
                }
            ) : Promise.resolve({ 
                success: true, 
                error: null, 
                data: null 
            }),
            setDefaultShippingAddress({ addressId: newDefaultAddressId })
        ]);

        if (!stripeResult.success) {
            return {
                success: false, 
                error: stripeResult.error,
                timestamp: Date.now()
            }
        }

        if (!setDefaultAddressResult.success) {
            return {
                success: false, 
                error: setDefaultAddressResult.error,
                timestamp: Date.now()
            }
        }

        return {
            success: true, 
            error: null, 
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Actions Error - Set Default Shipping Address error:', error);

        return {
            success: false, 
            error: SHIPPING_ADDRESS_ERROR.SET_DEFAULT_FAILED,
            timestamp: Date.now()
        }
    }
}