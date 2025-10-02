import { useEffect, useState, useMemo, useCallback } from "react"
import { useFormState } from "react-dom"

import { updateShippingAddressAction } from "@/services/shipping-address/actions"
import { showSuccessToast } from "@/components/common/display/Toasts"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { ALREADY_SAVED_MESSAGE } = ERROR_MESSAGES;

const useUpdateShippingAddressForm = (shippingAddresses: ShippingAddress[]) => {
    const [updateState, updateFormAction] = useFormState(updateShippingAddressAction, { 
        success: false, 
        error: null,
        data: null,
        timestamp: 0
    })

    const otherShippingAddresses = useMemo(() => 
        shippingAddresses
            .filter((shippingAddress) => !shippingAddress.is_default)
            .sort((a, b) => new Date(a.created_at)
            .getTime() - new Date(b.created_at)
            .getTime()), 
        [shippingAddresses]
    )
    
    const [optimisticOtherAddresses, setOptimisticOtherAddresses] = useState<ShippingAddress[]>(otherShippingAddresses);
    const [editModalActive, setEditModalActive] = useState(false);
    const [editAddressId, setEditAddressId] = useState<ShippingAddressId | null>(null);

    const editTarget = useMemo(() => 
        optimisticOtherAddresses.find(addr => addr.id === editAddressId), 
        [optimisticOtherAddresses, editAddressId]
    )

    const isAddressChanged = useCallback((formData: FormData) => {
        const name = formData.get('name') as string;
        const postalCode = formData.get('postal_code') as string;
        const state = formData.get('state') as string;
        const addressLine1 = formData.get('address_line1') as string;
        const addressLine2 = formData.get('address_line2') as string;

        return editTarget?.name !== name ||
               editTarget?.postal_code !== postalCode ||
               editTarget?.state !== state ||
               editTarget?.address_line1 !== addressLine1 ||
               editTarget?.address_line2 !== addressLine2;
    }, [editTarget])

    const handleAddressUpdate = useCallback((formData: FormData) => {
        if (!isAddressChanged(formData)) {
            setEditModalActive(false);
            showSuccessToast(ALREADY_SAVED_MESSAGE);
            return;
        }
        updateFormAction(formData);
    }, [isAddressChanged, updateFormAction])

    const handleEditAddressId = useCallback((id: ShippingAddressId) => {
        setEditModalActive(true);
        setEditAddressId(id);
    }, [])

    useEffect(() => {
        if (updateState.success && updateState.data) {
            setOptimisticOtherAddresses(prev => 
                prev.map(address => 
                    address.id === editAddressId && updateState.data
                        ? updateState.data 
                        : address
                )
            );
            setEditModalActive(false);
        } else if (updateState.error) {
            setEditModalActive(false);
        }
    }, [updateState, editAddressId])

    return {
        updateSuccess: updateState.success,
        errorMessage: updateState.error,
        timestamp: updateState.timestamp,
        editModalActive,
        optimisticOtherAddresses,
        setOptimisticOtherAddresses,
        setEditModalActive,
        handleEditAddressId,
        editTarget,
        handleAddressUpdate
    }
}

export default useUpdateShippingAddressForm