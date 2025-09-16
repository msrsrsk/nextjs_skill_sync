import { useEffect, useState } from "react"
import { useFormState } from "react-dom"

import { createShippingAddressAction } from "@/lib/services/shipping-address/actions"

interface UseAddShippingAddressFormProps {
    optimisticOtherAddresses: ShippingAddress[];
    setOptimisticOtherAddresses: (addresses: ShippingAddress[]) => void;
}

const useAddShippingAddressForm = ({ 
    optimisticOtherAddresses,
    setOptimisticOtherAddresses 
}: UseAddShippingAddressFormProps) => {

    const [addState, addFormAction] = useFormState(createShippingAddressAction, { 
        success: false, 
        error: null,
        data: null,
        timestamp: 0
    })

    const [addModalActive, setAddModalActive] = useState(false);

    useEffect(() => {
        if (addState.success && addState.data) {
            setOptimisticOtherAddresses([...optimisticOtherAddresses, addState.data]);
            setAddModalActive(false);
        } else if (addState.error) {
            setAddModalActive(false);
        }
    }, [addState])

    return {
        addSuccess: addState.success,
        errorMessage: addState.error,
        timestamp: addState.timestamp,
        addFormAction,
        addModalActive,
        setAddModalActive,
    }
}

export default useAddShippingAddressForm