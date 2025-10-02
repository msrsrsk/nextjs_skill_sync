import { useFormState } from "react-dom"

import { sendVerificationEmailAction } from "@/services/auth/actions"

const useVerificationForm = (type: EmailVerificationPageType) => {
    const [verificationState, verificationFormAction] = useFormState((
        prevState: ActionStateWithEmailAndTimestamp, 
        formData: FormData
    ) => sendVerificationEmailAction(prevState, formData, type), { 
        success: false, 
        error: null,
        email: undefined,
        timestamp: 0
    });

    return {
        verificationSuccess: verificationState.success,
        errorMessage: verificationState.error,
        email: verificationState.email,
        timestamp: verificationState.timestamp,
        verificationFormAction,
    };
};

export default useVerificationForm