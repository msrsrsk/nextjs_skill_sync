"use client"

import { useState, useEffect } from "react"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import AuthenticateFormContent from "@/components/ui/auth/AuthenticateFormContent"
import PasswordCheckContent from "@/components/ui/auth/PasswordCheckContent"
import useSignInForm from "@/hooks/form/useSignInForm"
import { 
    AUTH_TYPES, 
    EDIT_PASSWORD_STEP, 
    UPDATE_PASSWORD_PAGE_TYPES 
} from "@/constants/index"

const { AUTH_REAUTHENTICATE } = AUTH_TYPES;
const { PASSWORD_REAUTHENTICATE, PASSWORD_EDIT } = EDIT_PASSWORD_STEP;
const { EDIT_PASSWORD_PAGE } = UPDATE_PASSWORD_PAGE_TYPES;

const EditPasswordPage = () => {
    const [step, setStep] = useState<EditPasswordStepType>(PASSWORD_REAUTHENTICATE);

    const {
        signInSuccess,
        errorMessage: signInErrorMessage,
        timestamp: signInTimestamp,
        SignInFormAction,
    } = useSignInForm(AUTH_REAUTHENTICATE);

    useEffect(() => {
        if (signInSuccess) {
            setStep(PASSWORD_EDIT);
        }
    }, [signInSuccess]);

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Edit Password" 
                customClass="mt-6 mb-8 md:mt-10 md:mb-10" 
            />

            {step === PASSWORD_REAUTHENTICATE && <>
                <p className="page-description">
                    ※パスワードを変更するには<br />
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
            {step === PASSWORD_EDIT && (
                <PasswordCheckContent type={EDIT_PASSWORD_PAGE} />
            )}
        </div>
    </>
}

export default EditPasswordPage