"use client"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import EmailSent from "@/components/ui/auth/EmailSent"
import EmailCheckContent from "@/components/ui/auth/EmailCheckContent"
import useVerificationForm from "@/hooks/form/useVerificationForm"
import { EMAIL_VERIFICATION_TYPES, SITE_MAP } from "@/constants/index"

const { RESET_PASSWORD_TYPE } = EMAIL_VERIFICATION_TYPES;
const { LOGIN_PATH } = SITE_MAP;

const ResetPasswordPage = () => {
    const {
        verificationSuccess,
        errorMessage,
        email,
        timestamp,
        verificationFormAction,
    } = useVerificationForm(RESET_PASSWORD_TYPE);

    const isEmailSent = verificationSuccess && email;

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            {isEmailSent ? (
                <EmailSent 
                    email={email}
                    success={verificationSuccess}
                    pathname={LOGIN_PATH}
                    buttonText="ログイン画面"
                />
            ) : (
                <EmailCheckContent 
                    title="Reset Password" 
                    description={<>
                        ご登録のメールアドレスを入力してください<br />
                        パスワードの再設定メールを送信いたします
                    </>}
                    formAction={verificationFormAction}
                    errorMessage={errorMessage}
                    timestamp={timestamp}
                />
            )}
        </div>
    </>
}

export default ResetPasswordPage