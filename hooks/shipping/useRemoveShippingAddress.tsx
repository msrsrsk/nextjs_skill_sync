import { useCallback, useState } from "react"

import { SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SHIPPING_ADDRESS_API_PATH } = SITE_MAP;
const { SHIPPING_ADDRESS_ERROR } = ERROR_MESSAGES;

interface useRemoveShippingAddressProps {
    optimisticOtherAddresses: ShippingAddress[];
    setOptimisticOtherAddresses: (addresses: ShippingAddress[]) => void;
}

const useRemoveShippingAddress = ({ 
    optimisticOtherAddresses,
    setOptimisticOtherAddresses 
}: useRemoveShippingAddressProps) => {
    const [removeModalActive, setRemoveModalActive] = useState(false);
    const [removeAddressId, setRemoveAddressId] = useState<ShippingAddressId | null>(null);
    const [loading, setLoading] = useState(false);
    const [removeSuccess, setRemoveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timestamp, setTimestamp] = useState(0);

    const removeShippingAddress = useCallback(async () => {
        if (loading || !removeAddressId) return;

        setLoading(true);
        setError(null);
        setRemoveSuccess(false);

        try {
            // throw new Error('test error');

            const response = await fetch(`${SHIPPING_ADDRESS_API_PATH}?addressId=${removeAddressId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();

            if (result.success) {
                setOptimisticOtherAddresses(optimisticOtherAddresses
                    .filter((address) => address.id !== removeAddressId));
                setRemoveSuccess(true);
            } else {
                setError(result.message);
                setRemoveSuccess(false);
            }
        } catch (error) {
            console.error('Hook Error - Remove Shipping Address error:', error);
            setError(SHIPPING_ADDRESS_ERROR.DELETE_FAILED);
            setRemoveSuccess(false);
        } finally {
            setLoading(false);
            setRemoveModalActive(false);
            setTimestamp(Date.now());
        }
    }, [loading, removeAddressId]);

    const handleRemoveAddressId = useCallback((id: ShippingAddressId) => {
        setRemoveAddressId(id);
        setRemoveModalActive(true);
    }, [])

    return {
        loading,
        removeSuccess,
        error,
        timestamp,
        removeModalActive,
        setRemoveModalActive,
        handleRemoveAddressId,
        removeShippingAddress,
    }
}

export default useRemoveShippingAddress