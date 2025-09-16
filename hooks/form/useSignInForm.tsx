import { useFormState } from "react-dom"

import { signInWithCredentialsAction } from "@/lib/services/auth/actions";

const useSignInForm = (type: AuthType) => {
    const [SignInState, SignInFormAction] = useFormState((
        prevState: ActionStateWithTimestamp, 
        formData: FormData
    ) => signInWithCredentialsAction(prevState, formData, type), { 
        success: false, 
        error: null,
        timestamp: 0
    })

    return {
        signInSuccess: SignInState.success && SignInState.timestamp > 0,
        errorMessage: SignInState.error,
        timestamp: SignInState.timestamp,
        SignInFormAction,
    }
}

export default useSignInForm