import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { verifyResetPasswordToken } from "@/services/auth/actions"
import { startTokenValidation } from "@/lib/utils/validation"
import { SITE_MAP, VERIFICATION_STATUS } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { STATUS_LOADING, STATUS_SUCCESS, STATUS_ERROR } = VERIFICATION_STATUS;
const { NOT_FOUND_PATH } = SITE_MAP;
const { AUTH_ERROR } = ERROR_MESSAGES;

const useResetPasswordVerification = () => {
    const [
        verificationStatus, 
        setVerificationStatus
    ] = useState<VerificationStatusType>(STATUS_LOADING);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleTokenExpiry = () => {
        setVerificationStatus(STATUS_ERROR);
        setErrorMessage(AUTH_ERROR.EXPIRED_PASSWORD_TOKEN);
    }

    useEffect(() => {
        const verifyResetToken = async () => {
            const token = searchParams.get('token');

            if (!token) {
                router.push(NOT_FOUND_PATH);
                return;
            }

            try {
                const passwordTokenResult = await verifyResetPasswordToken(token);
                
                if (passwordTokenResult.success) {
                    setVerificationStatus(STATUS_SUCCESS);

                    if (passwordTokenResult.expires) {
                        const expiryTime = new Date(passwordTokenResult.expires);
                        setTokenExpiry(expiryTime);

                        const timeoutId = startTokenValidation(
                            expiryTime, 
                            handleTokenExpiry
                        );
                        intervalRef.current = timeoutId;
                    }
                } else {
                    setVerificationStatus(STATUS_ERROR);
                    setErrorMessage(passwordTokenResult.error);
                }
            } catch (error) {
                console.error('Hook Error - Reset Password Verification error:', error);
                setVerificationStatus(STATUS_ERROR);
                setErrorMessage(AUTH_ERROR.FAILED_PASSWORD_TOKEN_PROCESS);
            }
        };

        verifyResetToken();

        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
            }
        };
    }, [searchParams]);

    return {
        verificationStatus,
        errorMessage,
    }
}

export default useResetPasswordVerification