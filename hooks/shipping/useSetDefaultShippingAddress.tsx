import { useState, useEffect, useCallback } from 'react'
import { useFormState } from 'react-dom'

import { setDefaultShippingAddressAction } from '@/lib/services/stripe/actions';

interface UseSetDefaultShippingAddressProps {
    optimisticDefaultAddress: ShippingAddress | null;
    optimisticOtherAddresses: ShippingAddress[];
    setOptimisticDefaultAddress: (address: ShippingAddress) => void;
    setOptimisticOtherAddresses: (addresses: ShippingAddress[]) => void;
}

const useSetDefaultShippingAddress = ({
    optimisticDefaultAddress,
    optimisticOtherAddresses,
    setOptimisticDefaultAddress,
    setOptimisticOtherAddresses
}: UseSetDefaultShippingAddressProps) => {

    const [setDefaultState, setDefaultFormAction] = useFormState(setDefaultShippingAddressAction, {
        success: false,
        error: null,
        timestamp: 0
    });

    const [addressId, setAddressId] = useState<string | null>(null);
    const [setDefaultModalActive, setSetDefaultModalActive] = useState(false);

    const handleSetDefaultCheck = useCallback(async (addressId: string) => {
        setAddressId(addressId);
        setSetDefaultModalActive(true);
    }, [])
    
    const handleConfirmDefault = useCallback(() => {
        if (addressId) {
            const formData = new FormData();
            formData.append('newDefaultAddressId', addressId);
            setDefaultFormAction(formData);
        }
    }, [addressId])

    const handleCancelDefault = useCallback(() => {
        setSetDefaultModalActive(false);
        setAddressId(null);
    }, [])

    useEffect(() => {
        if (setDefaultState.success && setDefaultState.timestamp) {
            const newDefaultAddress = optimisticOtherAddresses
                .find(addr => addr.id === addressId);

            if (newDefaultAddress) {
                const newOtherAddresses = optimisticOtherAddresses
                    .filter(addr => addr.id !== addressId);

                if (optimisticDefaultAddress) {
                    const updatedOtherAddresses = [
                        ...newOtherAddresses,
                        optimisticDefaultAddress
                    ];
                    updatedOtherAddresses
                        .sort((a, b) => new Date(a.created_at)
                        .getTime() - new Date(b.created_at)
                        .getTime());

                    setOptimisticOtherAddresses(updatedOtherAddresses);
                } else {
                    setOptimisticOtherAddresses(newOtherAddresses);
                }

                setOptimisticDefaultAddress(newDefaultAddress);
            }

            handleCancelDefault();
        } else if (setDefaultState.error) {
            handleCancelDefault();
        }
    }, [setDefaultState]);

    return {
        setDefaultSuccess: setDefaultState.success,
        errorMessage: setDefaultState.error,
        timestamp: setDefaultState.timestamp,
        handleSetDefaultCheck,
        handleConfirmDefault,
        setDefaultModalActive,
        setSetDefaultModalActive,
    };
}

export default useSetDefaultShippingAddress