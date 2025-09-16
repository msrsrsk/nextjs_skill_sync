import { useState, useCallback } from "react"
import { z } from "zod"

import { doublePasswordSchema } from "@/lib/utils/zod"

const useDoublePasswordValidation = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRevealPassword, setIsRevealPassword] = useState(false);
    const [isRevealConfirmPassword, setIsRevealConfirmPassword] = useState(false);
    const [errorList, setErrorList] = useState<string[]>([]);
    const [errorListConfirm, setErrorListConfirm] = useState<string[]>([]);
    const [isValid, setIsValid] = useState(false);

    const validatePasswords = useCallback((newPassword: string, newConfirmPassword: string) => {
        try {
            doublePasswordSchema.parse({ 
                password: newPassword, 
                confirmPassword: newConfirmPassword 
            });
            setErrorList([]);
            setErrorListConfirm([]);
            setIsValid(true);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const passwordErrors = error.errors
                    .filter(error => error.path.includes('password'))
                    .map(error => error.message);

                const confirmErrors = error.errors
                    .filter(error => error.path.includes('confirmPassword'))
                    .map(error => error.message);

                setErrorList(passwordErrors);
                setErrorListConfirm(confirmErrors);
                setIsValid(false);
            }
        }
    }, [])

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        validatePasswords(value, confirmPassword);
    }, [validatePasswords, confirmPassword])

    const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        validatePasswords(password, value);
    }, [validatePasswords, password])

    const resetPassword = useCallback(() => {
        setPassword('');
        setConfirmPassword('');
        setErrorList([]);
        setErrorListConfirm([]);
        setIsValid(false);
    }, [])

    return {
        password,
        confirmPassword,
        isRevealPassword,
        isRevealConfirmPassword,
        setIsRevealPassword,
        setIsRevealConfirmPassword,
        errorList,
        errorListConfirm,
        isValid,
        handlePasswordChange,
        handleConfirmPasswordChange,
        resetPassword
    }
}

export default useDoublePasswordValidation