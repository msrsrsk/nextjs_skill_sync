import { useEffect, useState, useCallback, useMemo } from "react"
import { useFormState } from "react-dom"

import { updateDefaultShippingAddressAction } from "@/services/shipping-address/actions"
import { showSuccessToast } from "@/components/common/display/Toasts"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ALREADY_SAVED_MESSAGE } = ERROR_MESSAGES;

const useUpdateDefaultShippingAddressForm = (
    shippingAddresses: ShippingAddress[]
) => {
    const [updateDefaultState, updateDefaultFormAction] = useFormState(updateDefaultShippingAddressAction, { 
        success: false, 
        error: null,
        data: null,
        timestamp: 0
    })

    const defaultShippingAddress = useMemo(() => 
        shippingAddresses.find((shippingAddress) => shippingAddress.is_default), 
        [shippingAddresses]
    )
        
    const [optimisticDefaultAddress, setOptimisticDefaultAddress] = useState<ShippingAddress | null>(defaultShippingAddress as ShippingAddress);
    const [editDefaultModalActive, setEditDefaultModalActive] = useState(false);

    const isDefaultAddressChanged = useCallback((formData: FormData) => {
        const name = formData.get('name') as string;
        const postalCode = formData.get('postal_code') as string;
        const state = formData.get('state') as string;
        const addressLine1 = formData.get('address_line1') as string;
        const addressLine2 = formData.get('address_line2') as string;

        return optimisticDefaultAddress?.name !== name ||
               optimisticDefaultAddress?.postal_code !== postalCode ||
               optimisticDefaultAddress?.state !== state ||
               optimisticDefaultAddress?.address_line1 !== addressLine1 ||
               optimisticDefaultAddress?.address_line2 !== addressLine2;
    }, [optimisticDefaultAddress])

    const handleDefaultAddressUpdate = useCallback((formData: FormData) => {
        if (!isDefaultAddressChanged(formData)) {
            setEditDefaultModalActive(false);
            showSuccessToast(ALREADY_SAVED_MESSAGE);
            return;
        }
        updateDefaultFormAction(formData);
    }, [isDefaultAddressChanged, updateDefaultFormAction])

    useEffect(() => {
        if (updateDefaultState.success && updateDefaultState.data) {
            setOptimisticDefaultAddress(updateDefaultState.data);
            setEditDefaultModalActive(false);
        } else if (updateDefaultState.error) {
            setEditDefaultModalActive(false);
        }
    }, [updateDefaultState])

    return {
        updateDefaultSuccess: updateDefaultState.success,
        errorMessage: updateDefaultState.error,
        timestamp: updateDefaultState.timestamp,
        optimisticDefaultAddress,
        setOptimisticDefaultAddress,
        editDefaultModalActive,
        setEditDefaultModalActive,
        handleDefaultAddressUpdate,
    }
}

export default useUpdateDefaultShippingAddressForm