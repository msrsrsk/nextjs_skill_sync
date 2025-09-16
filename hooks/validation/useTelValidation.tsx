import { useState, useCallback } from "react"
import { z } from "zod"

import { telSchema } from "@/lib/utils/zod"

const useTelValidation = () => {
    const [tel, setTel] = useState('');
    const [errorList, setErrorList] = useState<string[]>([]);
    const [isValid, setIsValid] = useState(false);

    const validateTel = useCallback((tel: string) => {
        try {
            telSchema.parse({ tel });
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

    const handleTelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTel(value);
        validateTel(value);
    }, [validateTel])

    const resetTel = useCallback(() => {
        setTel('');
        setErrorList([]);
        setIsValid(false);
    }, [])

    return {
        tel,
        setTel,
        errorList,
        isValid,
        handleTelChange,
        resetTel,
        validateTel
    }
}

export default useTelValidation