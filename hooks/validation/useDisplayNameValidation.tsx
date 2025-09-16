import { useState, useCallback } from "react"
import { z } from "zod"

import { displayNameSchema } from "@/lib/utils/zod"

const useDisplayNameValidation = () => {
    const [displayName, setDisplayName] = useState('');
    const [errorList, setErrorList] = useState<string[]>([]);
    const [isValid, setIsValid] = useState(false);

    const validateName = useCallback((displayName: string) => {
        try {
            displayNameSchema.parse({ displayName });
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

    const handleDisplayNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDisplayName(value);
        validateName(value);
    }, [validateName])

    const resetDisplayName = useCallback(() => {
        setDisplayName('');
        setErrorList([]);
        setIsValid(false);
    }, [])

    return {
        displayName,
        setDisplayName,
        errorList,
        isValid,
        handleDisplayNameChange,
        resetDisplayName,
        validateName,
    }
}

export default useDisplayNameValidation