import { useState, useCallback } from "react"
import { z } from "zod"

import { nameSchema } from "@/lib/utils/zod"

const useNameValidation = () => {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [errorList, setErrorList] = useState<string[]>([]);
    const [isValid, setIsValid] = useState(false);

    const validateName = useCallback((lastName: string, firstName: string) => {
        try {
            nameSchema.parse({ lastName, firstName });
            setErrorList([]);
            setIsValid(true);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const allErrors = error.errors.map(e => e.message);
                const uniqueErrors = allErrors.filter((error, index, self) => 
                    self.indexOf(error) === index
                );
                setErrorList(uniqueErrors);
                setIsValid(false);
            }
        }
    }, [])

    const handleLastNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLastName(value);
        validateName(value, firstName);
    }, [validateName, firstName])

    const handleFirstNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFirstName(value);
        validateName(lastName, value);
    }, [validateName, lastName])

    const resetName = useCallback(() => {
        setLastName('');
        setFirstName('');
        setErrorList([]);
        setIsValid(false);
    }, [])

    return {
        lastName,
        setLastName,
        firstName,
        setFirstName,
        errorList,
        isValid,
        handleLastNameChange,
        handleFirstNameChange,
        resetName,
        validateName
    }
}

export default useNameValidation