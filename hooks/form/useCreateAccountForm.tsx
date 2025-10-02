import { useFormState } from "react-dom"

import { createAccountWithEmailAction } from '@/services/auth/actions'

const useCreateAccountForm = () => {
    const [createState, createFormAction] = useFormState(createAccountWithEmailAction, { 
        success: false, 
        error: null,
        email: undefined,
        timestamp: 0
    })

    return {
        createSuccess: createState.success,
        errorMessage: createState.error,
        email: createState.email,
        timestamp: createState.timestamp,
        createFormAction,
    }
}

export default useCreateAccountForm