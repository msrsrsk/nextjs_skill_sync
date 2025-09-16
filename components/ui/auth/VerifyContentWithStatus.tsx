"use client"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import LottieAnimation from "@/components/ui/display/LottieAnimation"
import congrats from"@/data/congrats.json"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import useAccountVerification from "@/hooks/auth/useAccountVerification"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { BUTTON_SIZES, BUTTON_TEXT_TYPES, VERIFICATION_STATUS } from "@/constants/index"

const { BUTTON_MEDIUM, BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { STATUS_LOADING, STATUS_SUCCESS, STATUS_ERROR } = VERIFICATION_STATUS;

interface VerifyContentWithStatusProps {
    verifyEmailType: VerifyEmailType;
    errorButtonPath: string;
    errorButtonText: string;
    successDescription: React.ReactNode;
    successButtonPath: string;
    successButtonText: string;
    successButtonSize?: ButtonSizeType;
}

const VerifyContentWithStatus = ({
    verifyEmailType,
    errorButtonPath,
    errorButtonText,
    successButtonPath,
    successButtonText,
    successDescription,
    successButtonSize = BUTTON_MEDIUM,
}: VerifyContentWithStatusProps) => {
    const { 
        verificationStatus, 
        errorMessage 
    } = useAccountVerification({ verifyEmailType });

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            {verificationStatus === STATUS_LOADING && (
                <>
                    <PageTitle 
                        title="Verify Account" 
                        customClass="mt-6 mb-8 md:my-10"
                    />
                    <div className="max-w-sm mx-auto">
                        <p className="attention-text text-center">
                            ただいま認証中です。<br />
                            しばらくお待ちください。
                        </p>
                        <LoadingSpinner />
                    </div>
                </>
            )}

            {verificationStatus === STATUS_ERROR && (
                <>
                    <PageTitle 
                        title="Verify Account" 
                        customClass="mt-6 mb-8 md:my-10"
                    />
                    <div className="max-w-sm mx-auto">
                        <p className="attention-text text-center whitespace-pre-line">
                            {errorMessage}
                        </p>

                        <LinkButtonPrimary
                            link={errorButtonPath}
                            customClass="button-space-default"
                            size={BUTTON_LARGE}
                            text={BUTTON_JA}
                        >
                            {errorButtonText}
                        </LinkButtonPrimary>
                    </div>
                </>
            )}

            {verificationStatus === STATUS_SUCCESS && (
                <>
                    <div className="mt-6 mb-8 md:my-10 relative flex justify-center">
                        <PageTitle 
                            title="Verify Account" 
                        />
                        <LottieAnimation 
                            data={congrats} 
                            customClass="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                        />
                    </div>

                    <div className="max-w-sm mx-auto relative z-10">
                        <p className="attention-text text-center">
                            {successDescription}
                        </p>
                        <LinkButtonPrimary
                            link={successButtonPath}
                            customClass="button-space-default"
                            size={successButtonSize}
                            text={BUTTON_JA}
                        >
                            {successButtonText}
                        </LinkButtonPrimary>
                    </div>
                </>
            )}
        </div>
    </>
}

export default VerifyContentWithStatus