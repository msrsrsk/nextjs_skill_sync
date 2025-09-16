import { useState, useCallback, useMemo } from "react"
import { z } from "zod"

import { textareaSchema, reviewSchema } from "@/lib/utils/zod"
import { TEXTAREA_SCHEMA_TYPES } from "@/constants/index"

const { TEXTAREA_TYPE, REVIEW_TYPE } = TEXTAREA_SCHEMA_TYPES;

interface UseTextareaValidationProps {
    schemaType?: TextareaSchemaType;
}

const useTextareaValidation = ({ schemaType = TEXTAREA_TYPE }: UseTextareaValidationProps = {}) => {
    const [textarea, setTextarea] = useState('');
    const [errorList, setErrorList] = useState<string[]>([]);
    const [isValid, setIsValid] = useState(false);

    const schema = useMemo(() => 
        schemaType === REVIEW_TYPE ? reviewSchema : textareaSchema, 
        [schemaType]
    );

    const validateTextarea = useCallback((textarea: string) => {
        try {
            schema.parse({ textarea });
            setErrorList([]);
            setIsValid(true);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(error => error.message);
                setErrorList(errorMessages);
                setIsValid(false);
            }
        }
    }, [schema]);

    const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setTextarea(value);
        validateTextarea(value);
    }, [validateTextarea]);

    return {
        textarea,
        setTextarea,
        errorList,
        isValid,
        handleTextareaChange,
    }
}

export default useTextareaValidation