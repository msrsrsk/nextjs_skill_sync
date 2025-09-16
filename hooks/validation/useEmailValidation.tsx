import { useState, useCallback } from "react"
import { z } from "zod"

import { emailSchema } from "@/lib/utils/zod"

const useEmailValidation = () => {
    const [email, setEmail] = useState('');
    const [errorList, setErrorList] = useState<string[]>([]);
    const [isValid, setIsValid] = useState(false);

    const validateEmail = useCallback((value: string) => {
        try {
            emailSchema.parse({ email: value });
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

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        validateEmail(value);
    }, [validateEmail])

    const resetEmail = useCallback(() => {
        setEmail('');
        setErrorList([]);
        setIsValid(false);
    }, [])

    return {
        email,
        setEmail,
        errorList,
        isValid,
        handleEmailChange,
        resetEmail,
        validateEmail
    }
}

export default useEmailValidation