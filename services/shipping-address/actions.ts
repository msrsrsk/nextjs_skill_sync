"use server"

import { 
    createShippingAddressRepository, 
    getShippingAddressRepository,
    updateShippingAddressRepository, 
    deleteShippingAddressRepository 
} from "@/repository/shippingAddress"
import { updateCustomerShippingAddress } from "@/services/stripe/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SHIPPING_ADDRESS_ERROR } = ERROR_MESSAGES;

interface UpdateStripeAndShippingAddressProps extends UserIdProps {
    id: ShippingAddressId;
    customerId: StripeCustomerId;
    shippingAddress: ShippingAddress;
}

// 配送先住所の作成
export const createShippingAddress = async ({
    address
}: { address: ShippingAddress }) => {
    const repository = createShippingAddressRepository();
    const result = await repository.createShippingAddress({ address });

    return {
        success: !!result, 
        data: result
    }
}

// デフォルト住所の取得
export const getDefaultShippingAddress = async ({ 
    userId 
}: UserIdProps) => {
    const repository = getShippingAddressRepository();
    const result = await repository.getUserDefaultShippingAddress({
        userId
    });

    return { data: result }
}

// IDによる住所の取得
export const getShippingAddressById = async ({
    userId,
    addressId
}: ShippingAddressWithUserProps) => {
    const shippingAddressRepository = getShippingAddressRepository();
    const result = await shippingAddressRepository.getShippingAddressById({
        userId,
        addressId
    });

    return { data: result }
}

// 住所の更新
export const updateShippingAddress = async ({
    id,
    userId,
    shippingAddress
}: UpdateShippingAddressProps) => {
    const repository = updateShippingAddressRepository();
    const result = await repository.updateShippingAddress({
        id,
        userId,
        shippingAddress
    });

    return {
        success: !!result, 
        data: result
    }
}

// 住所の更新 & Stripe顧客情報の更新
export const updateStripeAndShippingAddress = async ({
    id,
    userId,
    customerId,
    shippingAddress
}: UpdateStripeAndShippingAddressProps) => {
    try {
        if (!id || !userId || !shippingAddress) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.MISSING_USER_INFO,
                data: null 
            }
        }

        const [stripeResult, setAddressResult] = await Promise.all([
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
                userId,
                shippingAddress
            })
        ]);
    
        if (!stripeResult.success) {
            return {
                success: false, 
                error: stripeResult.error as string,
                data: null 
            }
        }
    
        if (!setAddressResult.success) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.UPDATE_FAILED,
                data: null 
            }
        }
    
        return {
            success: true, 
            error: null, 
            data: setAddressResult.data
        }
    } catch (error) {
        console.error('Database : Error in updateStripeAndShippingAddress:', error);

        return {
            success: false, 
            error: SHIPPING_ADDRESS_ERROR.UPDATE_FAILED,
            data: null 
        }
    }
}

// デフォルト住所の更新 & Stripe顧客情報の更新
export const updateStripeAndDefaultShippingAddress = async ({
    id,
    userId,
    customerId,
    shippingAddress
}: UpdateStripeAndShippingAddressProps) => {
    try {
        if (!id || !userId || !shippingAddress) {
            return {
                success: false, 
                error: SHIPPING_ADDRESS_ERROR.MISSING_USER_INFO,
            }
        }
        
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
            }),
            setDefaultShippingAddress({ 
                userId,
                addressId: id 
            })
        ]);
    
        if (!stripeResult.success) {
            return {
                success: false, 
                error: stripeResult.error as string,
            }
        }
    
        if (!setDefaultAddressResult.success) {
            return {
                success: false, 
                error: setDefaultAddressResult.error as string,
            }
        }

        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Database : Error in updateStripeAndDefaultShippingAddress:', error);

        return {
            success: false, 
            error: SHIPPING_ADDRESS_ERROR.UPDATE_FAILED,
        }
    }
}

// デフォルト住所の設定
export const setDefaultShippingAddress = async ({
    userId,
    addressId
}: ShippingAddressWithUserProps) => {
    try {
        const repository = updateShippingAddressRepository();
        await repository.updateDefaultShippingAddressesWithTransaction({ 
            userId,
            addressId 
        });

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in setDefaultShippingAddress:', error);

        return {
            success: false, 
            error: SHIPPING_ADDRESS_ERROR.SET_DEFAULT_FAILED,
        }
    }
}

// 住所の削除
export const deleteShippingAddress = async ({ 
    id,
    userId
}: DeleteShippingAddressProps) => {
    const repository = deleteShippingAddressRepository();
    const result = await repository.deleteShippingAddress({ id, userId });

    return { success: !!result }
}