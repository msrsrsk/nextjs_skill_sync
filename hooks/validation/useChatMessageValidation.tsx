import { useState, useCallback } from "react"
import { z } from "zod"

import { chatMessageSchema } from "@/lib/utils/zod"

const useChatMessageValidation = () => {
    const [chatMessage, setChatMessage] = useState('');
    const [errorList, setErrorList] = useState<string[]>([]);
    const [isValid, setIsValid] = useState(false);

    const validateMessage = useCallback((message: string) => {
        try {
            chatMessageSchema.parse({ message });
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

    const handleChatMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setChatMessage(value);
        validateMessage(value);
    }, [validateMessage])

    const resetChatMessage = useCallback(() => {
        setChatMessage('');
        setErrorList([]);
        setIsValid(false);
    }, [])

    return {
        chatMessage,
        setChatMessage,
        errorList,
        isValid,
        handleChatMessageChange,
        resetChatMessage,
    }
}

export default useChatMessageValidation