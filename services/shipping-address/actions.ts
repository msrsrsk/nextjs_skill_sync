import { 
    createShippingAddressRepository, 
    updateShippingAddressRepository, 
    deleteShippingAddressRepository 
} from "@/repository/shippingAddress"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SHIPPING_ADDRESS_ERROR } = ERROR_MESSAGES;

// 配送先住所の作成
export const createShippingAddress = async ({
    address
}: { address: ShippingAddress }) => {
    try {
        const repository = createShippingAddressRepository();
        const shippingAddress = await repository.createShippingAddress({ address });

        return {
            success: true, 
            error: null, 
            data: shippingAddress
        }
    } catch (error) {
        console.error('Database : Error in createShippingAddress: ', error);

        return {
            success: false, 
            error: SHIPPING_ADDRESS_ERROR.CREATE_FAILED,
            data: null
        }
    }
}

// 住所の更新
export const updateShippingAddress = async ({
    id,
    shippingAddress
}: UpdateShippingAddressProps) => {
    try {
        const repository = updateShippingAddressRepository();
        const shippingAddressData = await repository.updateShippingAddress({
            id,
            shippingAddress
        });

        return {
            success: true, 
            error: null, 
            data: shippingAddressData
        }
    } catch (error) {
        console.error('Database : Error in updateShippingAddress: ', error);

        return {
            success: false, 
            error: SHIPPING_ADDRESS_ERROR.UPDATE_FAILED,
            data: null
        }
    }
}

// デフォルト住所の設定
export const setDefaultShippingAddress = async ({
    addressId
}: { addressId: ShippingAddressId }) => {
    try {
        const repository = updateShippingAddressRepository();
        await repository.updateDefaultShippingAddressesWithTransaction({ addressId });

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
};

// 住所の削除
export const deleteShippingAddress = async ({ id }: { id: ShippingAddressId }) => {
    try {
        const repository = deleteShippingAddressRepository();
        await repository.deleteShippingAddress({ id });

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in deleteShippingAddress: ', error);

        return {
            success: false, 
            error: SHIPPING_ADDRESS_ERROR.DELETE_FAILED,
        }
    }
}