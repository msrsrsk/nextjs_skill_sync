"use client"

import Link from "next/link"
import { useFormStatus } from "react-dom"
import { usePathname } from "next/navigation"

import FormLabel from "@/components/common/forms/FormLabel"
import FormInput from "@/components/common/forms/FormInput"
import FormPassword from "@/components/common/forms/FormPassword"
import FormErrorText from "@/components/common/forms/FormErrorText"
import PendingContent from "@/components/common/buttons/PendingContent"
import useEmailValidation from "@/hooks/validation/useEmailValidation"
import usePasswordValidation from "@/hooks/validation/usePasswordValidation"
import useResetValue from "@/hooks/utils/useResetValue"
import useToastNotifications from "@/hooks/notification/useToastNotifications"
import { EventButtonPrimary } from "@/components/common/buttons/Button"
import { BUTTON_TEXT_TYPES, BUTTON_TYPES, SITE_MAP } from "@/constants/index"

const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { SUBMIT_TYPE } = BUTTON_TYPES;
const { RESET_PASSWORD_PATH, LOGIN_PATH } = SITE_MAP;

interface AuthenticateFormContentProps {
    formAction: (formData: FormData) => void;
    errorMessage: string | null;
    signInTimestamp: number;
    buttonText: string;
}

interface SubmitButtonProps {
    isValid: boolean;
    buttonText: string;
}

const AuthenticateFormContent = ({
    formAction,
    errorMessage,
    signInTimestamp,
    buttonText,
}: AuthenticateFormContentProps) => {
    const { 
        email,
        errorList: emailErrorList, 
        isValid: emailIsValid, 
        handleEmailChange,
        resetEmail
    } = useEmailValidation();
    const {
        password,
        isRevealPassword,
        setIsRevealPassword,
        errorList: passwordErrorList,
        isValid: passwordIsValid,
        handlePasswordChange,
        resetPassword
    } = usePasswordValidation();

    useResetValue({
        watchValue: errorMessage !== null,
        resetFunctions: [resetEmail, resetPassword]
    });

    useToastNotifications({
        error: errorMessage,
        timestamp: signInTimestamp,
    });

    const pathname = usePathname();

    const isLoginPage = pathname === LOGIN_PATH;
    const isValid = emailIsValid && passwordIsValid;

    return (
        <form action={formAction}>
            <div className="form-box">
                <div>
                    <FormLabel 
                        name="email" 
                        label="メールアドレス" 
                    />
                    <FormInput 
                        name="email" 
                        type="text" 
                        value={email}
                        placeholder="your-email@example.com" 
                        onChange={handleEmailChange}
                        error={emailErrorList}
                    />
                    <FormErrorText errorList={emailErrorList} />
                </div>
                <div>
                    <div className="flex items-start justify-between flex-wrap">
                        <FormLabel 
                            name="password" 
                            label="パスワード" 
                        />
                        {isLoginPage && (
                            <Link 
                                href={RESET_PASSWORD_PATH}
                                className="text-sm leading-7 underline font-medium"
                            >
                                パスワードをお忘れの方
                            </Link>
                        )}
                    </div>
                    <FormPassword 
                        value={password}
                        isRevealPassword={isRevealPassword}
                        setIsRevealPassword={setIsRevealPassword}
                        onChange={handlePasswordChange}
                        error={passwordErrorList}
                        customClass="bg-soft-white"
                    />
                    <FormErrorText errorList={passwordErrorList} />
                </div>
            </div>

            <SubmitButton isValid={isValid} buttonText={buttonText} />
        </form>
    );
}

const SubmitButton = ({ 
    isValid, 
    buttonText 
}: SubmitButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <EventButtonPrimary
            customClass="button-space-default"
            text={BUTTON_JA}
            type={SUBMIT_TYPE}
            disabled={!isValid || pending}
        >
            <PendingContent pending={pending} text={buttonText} />
        </EventButtonPrimary>
    );
};

export default AuthenticateFormContent