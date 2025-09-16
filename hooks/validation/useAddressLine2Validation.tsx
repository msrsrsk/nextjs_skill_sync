import { useState, useCallback } from "react"
import { z } from "zod"

import { addressLine2Schema } from "@/lib/utils/zod"

const useAddressLine2Validation = () => {
    const [addressLine2, setAddressLine2] = useState('');
    const [errorList, setErrorList] = useState<string[]>([]);

    const validateAddressLine2 = useCallback((value: string) => {
        try {
            addressLine2Schema.parse({ address_line2: value });
            setErrorList([]);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(error => error.message);
                setErrorList(errorMessages);
            }
        }
    }, [])

    const handleAddressLine2Change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAddressLine2(value);
        validateAddressLine2(value);
    }, [validateAddressLine2])

    const resetAddressLine2 = useCallback(() => {
        setAddressLine2('');
        setErrorList([]);
    }, [])

    return {
        addressLine2,
        setAddressLine2,
        errorList,
        handleAddressLine2Change,
        resetAddressLine2,
        validateAddressLine2,
    }
}

export default useAddressLine2Validation