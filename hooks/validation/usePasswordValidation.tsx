import { useState, useCallback } from "react"
import { z } from "zod"

import { passwordSchema } from "@/lib/utils/zod"

const usePasswordValidation = () => {
    const [password, setPassword] = useState('');
    const [isRevealPassword, setIsRevealPassword] = useState(false);
    const [errorList, setErrorList] = useState<string[]>([]);
    const [isValid, setIsValid] = useState(false);

    const validatePassword = useCallback((value: string) => {
        try {
            passwordSchema.parse({ password: value });
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

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        validatePassword(value);
    }, [validatePassword])

    const resetPassword = useCallback(() => {
        setPassword('');
        setErrorList([]);
        setIsValid(false);
    }, [])

    return {
        password,
        isRevealPassword,
        setIsRevealPassword,
        errorList,
        isValid,
        handlePasswordChange,
        resetPassword
    }
}

export default usePasswordValidation