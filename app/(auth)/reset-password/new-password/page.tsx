"use client"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import PasswordCheckContent from "@/components/ui/auth/PasswordCheckContent"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import useResetPasswordVerification from "@/hooks/auth/useResetPasswordVerification"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { 
    UPDATE_PASSWORD_PAGE_TYPES, 
    VERIFICATION_STATUS, 
    BUTTON_SIZES,
    BUTTON_TEXT_TYPES,
    SITE_MAP,
} from "@/constants/index"

const { RESET_PASSWORD_PAGE } = UPDATE_PASSWORD_PAGE_TYPES;
const { STATUS_LOADING, STATUS_SUCCESS, STATUS_ERROR } = VERIFICATION_STATUS;
const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { RESET_PASSWORD_PATH } = SITE_MAP;

const NewPasswordPage = () => {
    const { 
        verificationStatus, 
        errorMessage
    } = useResetPasswordVerification();

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Reset Password" 
                customClass="mt-6 mb-8 md:my-10"
            />

            {verificationStatus === STATUS_LOADING && (
                <div className="max-w-sm mx-auto">
                    <p className="attention-text text-center">
                        ただいま認証中です。<br />
                        しばらくお待ちください。
                    </p>
                    <LoadingSpinner />
                </div>
            )}

            {verificationStatus === STATUS_ERROR && (
                <div className="max-w-sm mx-auto">
                    <p className="attention-text text-center whitespace-pre-line">
                        {errorMessage}
                    </p>

                    <LinkButtonPrimary
                        link={RESET_PASSWORD_PATH}
                        size={BUTTON_LARGE}
                        text={BUTTON_JA}
                        customClass="button-space-default"
                    >
                        リセット画面に戻る
                    </LinkButtonPrimary>
                </div>
            )}

            {verificationStatus === STATUS_SUCCESS && (
                <PasswordCheckContent type={RESET_PASSWORD_PAGE} />
            )}
        </div>
    </>
}

export default NewPasswordPage;