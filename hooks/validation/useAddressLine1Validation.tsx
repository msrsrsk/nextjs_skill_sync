import { useState, useCallback } from "react"
import { z } from "zod"

import { addressLine1Schema } from "@/lib/utils/zod"

const useAddressLine1Validation = () => {
    const [addressLine1, setAddressLine1] = useState('');
    const [errorList, setErrorList] = useState<string[]>([]);
    const [isValid, setIsValid] = useState(false);

    const validateAddressLine1 = useCallback((value: string) => {
        try {
            addressLine1Schema.parse({ address_line1: value });
            setErrorList([]);
            setIsValid(true);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(error => error.message);
                setErrorList(errorMessages);
                setIsValid(false);
            }
        }
    }, [])

    const handleAddressLine1Change = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAddressLine1(value);
        validateAddressLine1(value);
    }, [validateAddressLine1])

    const resetAddressLine1 = useCallback(() => {
        setAddressLine1('');
        setErrorList([]);
        setIsValid(false);
    }, [])

    return {
        addressLine1,
        setAddressLine1,
        errorList,
        isValid,
        handleAddressLine1Change,
        resetAddressLine1,
        validateAddressLine1,
    }
}

export default useAddressLine1Validation