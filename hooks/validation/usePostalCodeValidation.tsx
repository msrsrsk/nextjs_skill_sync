import { useState, useCallback } from "react"
import { z } from "zod"

import { postalCodeSchema } from "@/lib/utils/zod"

const usePostalCodeValidation = () => {
    const [postalCode, setPostalCode] = useState('');
    const [errorList, setErrorList] = useState<string[]>([]);
    const [isValid, setIsValid] = useState(false);

    const validatePostalCode = useCallback((value: string) => {
        try {
            postalCodeSchema.parse({ postal_code: value });
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

    const handlePostalCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPostalCode(value);
        validatePostalCode(value);
    }, [validatePostalCode])

    const resetPostalCode = useCallback(() => {
        setPostalCode('');
        setErrorList([]);
        setIsValid(false);
    }, [])

    return {
        postalCode,
        setPostalCode,
        errorList,
        isValid,
        handlePostalCodeChange,
        resetPostalCode,
        validatePostalCode,
    }
}

export default usePostalCodeValidation