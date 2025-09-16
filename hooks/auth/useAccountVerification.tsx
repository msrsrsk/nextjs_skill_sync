import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { verifyEmailToken } from "@/lib/services/auth/actions"
import { SITE_MAP, VERIFICATION_STATUS } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { STATUS_LOADING, STATUS_SUCCESS, STATUS_ERROR } = VERIFICATION_STATUS;
const { NOT_FOUND_PATH } = SITE_MAP;
const { AUTH_ERROR } = ERROR_MESSAGES;

const useAccountVerification = ({
    verifyEmailType
}: { verifyEmailType: VerifyEmailType }) => {
    const [
        verificationStatus, 
        setVerificationStatus
    ] = useState<VerificationStatusType>(STATUS_LOADING);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasExecuted = useRef(false); 

    useEffect(() => {
        verifyAccount();
    }, [searchParams]);

    const verifyAccount = async () => {
        if (hasExecuted.current) return;

        const token = searchParams.get('token');

        if (!token) {
            router.push(NOT_FOUND_PATH);
            return;
        }

        hasExecuted.current = true;

        try {
            const emailTokenResult = await verifyEmailToken(token, verifyEmailType);
            
            if (emailTokenResult.success) {
                setVerificationStatus(STATUS_SUCCESS);
            } else {
                setVerificationStatus(STATUS_ERROR);
                setErrorMessage(emailTokenResult.error);
            }
        } catch (error) {
            console.error('Hook Error - Account Verification error:', error);
            
            setVerificationStatus(STATUS_ERROR);
            setErrorMessage(AUTH_ERROR.FAILED_EMAIL_TOKEN_PROCESS);
        }
    }

    return {
        verificationStatus,
        errorMessage,
    }
}

export default useAccountVerification