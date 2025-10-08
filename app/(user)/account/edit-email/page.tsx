"use client"

import { useState, useEffect } from "react"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import AuthenticateFormContent from "@/components/ui/auth/AuthenticateFormContent"
import EmailCheckContent from "@/components/ui/auth/EmailCheckContent"
import EmailSent from "@/components/ui/auth/EmailSent"
import useSignInForm from "@/hooks/form/useSignInForm"
import useVerificationForm from "@/hooks/form/useVerificationForm"
import { 
    EDIT_EMAIL_STEP, 
    EMAIL_VERIFICATION_TYPES, 
    AUTH_TYPES, 
    SITE_MAP 
} from "@/constants/index"

const { EMAIL_REAUTHENTICATE, EMAIL_EDIT } = EDIT_EMAIL_STEP;
const { UPDATE_EMAIL_TYPE } = EMAIL_VERIFICATION_TYPES;
const { AUTH_REAUTHENTICATE } = AUTH_TYPES;
const { ACCOUNT_INFO_PATH } = SITE_MAP;

const EditEmailPage = () => {
    const [step, setStep] = useState<EditEmailStepType>(EMAIL_REAUTHENTICATE);

    const {
        signInSuccess,
        errorMessage: signInErrorMessage,
        timestamp: signInTimestamp,
        SignInFormAction,
    } = useSignInForm(AUTH_REAUTHENTICATE);

    const {
        verificationSuccess,
        errorMessage: verificationErrorMessage,
        email,
        timestamp,
        verificationFormAction,
    } = useVerificationForm(UPDATE_EMAIL_TYPE);

    useEffect(() => {
        if (signInSuccess) {
            setStep(EMAIL_EDIT);
        }
    }, [signInSuccess]);

    const isEmailSent = verificationSuccess && email;

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            {step === EMAIL_REAUTHENTICATE && <>
                <PageTitle 
                    title="Edit Email" 
                    customClass="mt-6 mb-8 md:mt-10 md:mb-10" 
                />
    
                <p className="page-description">
                    ※メールアドレスを変更するには<br />
                    アカウントの再認証が必要です
                </p>
    
                <div className="max-w-sm mx-auto">
                    <AuthenticateFormContent 
                        formAction={SignInFormAction}
                        errorMessage={signInErrorMessage}
                        signInTimestamp={signInTimestamp}
                        buttonText="認証する"
                    />
                </div>
            </>}
            {step === EMAIL_EDIT && <>
                {isEmailSent ? (
                    <EmailSent 
                        email={email}
                        success={verificationSuccess}
                        pathname={ACCOUNT_INFO_PATH}
                        buttonText="お客様情報"
                    />
                ) : (
                    <EmailCheckContent 
                        title="Edit Email" 
                        description={<>
                            新しいメールアドレスを入力してください
                        </>}
                        formAction={verificationFormAction}
                        errorMessage={verificationErrorMessage as string}
                        timestamp={timestamp}
                    />
                )}
            </>
            }
        </div>
    </>
}

export default EditEmailPage