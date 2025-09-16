"use client"

import Link from "next/link"
import { useFormStatus } from "react-dom"

import PageTitle from "@/components/common/display/PageTitle"
import FormLabel from "@/components/common/forms/FormLabel"
import FormInput from "@/components/common/forms/FormInput"
import FormPassword from "@/components/common/forms/FormPassword"
import FormErrorText from "@/components/common/forms/FormErrorText"
import PendingContent from "@/components/common/buttons/PendingContent"
import useNameValidation from "@/hooks/validation/useNameValidation"
import useEmailValidation from "@/hooks/validation/useEmailValidation"
import usePasswordValidation from "@/hooks/validation/usePasswordValidation"
import useResetValue from "@/hooks/utils/useResetValue"
import useToastNotifications from "@/hooks/notification/useToastNotifications"
import { EventButtonPrimary } from "@/components/common/buttons/Button"
import { 
    BUTTON_SIZES, 
    BUTTON_TEXT_TYPES, 
    BUTTON_TYPES, 
    SITE_MAP 
} from "@/constants/index"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { SUBMIT_TYPE } = BUTTON_TYPES;
const { LOGIN_PATH } = SITE_MAP;

interface CreateAccountContentProps {
    createFormAction: (formData: FormData) => void;
    errorMessage: string | null;
    timestamp: number;
}

const CreateAccountContent = ({
    createFormAction,
    errorMessage,
    timestamp,
}: CreateAccountContentProps) => {
    const { 
        lastName,
        firstName,
        errorList: nameErrorList, 
        isValid: nameIsValid, 
        handleLastNameChange, 
        handleFirstNameChange,
        resetName
    } = useNameValidation();
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
        resetFunctions: [resetName, resetEmail, resetPassword]
    });

    useToastNotifications({
        error: errorMessage,
        timestamp,
    });

    const isValid = nameIsValid && emailIsValid && passwordIsValid;

    return <>
        <PageTitle 
            title="Create Account" 
            customClass="mt-6 mb-8 md:my-10" 
        />

        <p className="page-description">
            ※パスワードは半角英字、数字、記号を<br />
            組み合わせた 8~30 文字で入力してください
        </p>

        <div className="max-w-sm mx-auto">
            <form action={createFormAction}>
                <div className="form-box">
                    <div>
                        <FormLabel 
                            name="lastname" 
                            label="お名前" 
                        />
                        <div className="form-namebox">
                            <FormInput 
                                name="lastname" 
                                type="text" 
                                value={lastName}
                                placeholder="姓" 
                                onChange={handleLastNameChange}
                                error={nameErrorList}
                            />
                            <FormInput 
                                name="firstname" 
                                type="text" 
                                value={firstName}
                                placeholder="名" 
                                onChange={handleFirstNameChange}
                                error={nameErrorList}
                            />
                        </div>
                        <FormErrorText errorList={nameErrorList} />
                    </div>
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
                        <FormLabel 
                            name="password" 
                            label="パスワード" 
                        />
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

                <CreateAccountButton isValid={isValid} />
            </form>

            <Link href={LOGIN_PATH} className="link-text">
                <p>既にアカウントをお持ちの方はこちら</p>
            </Link>
        </div>
    </>
}

const CreateAccountButton = ({ isValid }: { isValid: boolean }) => {
    const { pending } = useFormStatus();

    return (
        <EventButtonPrimary
            customClass="button-space-default"
            size={BUTTON_LARGE}
            text={BUTTON_JA}
            type={SUBMIT_TYPE}
            disabled={!isValid || pending}
        >
            <PendingContent 
                pending={pending} 
                text="アカウントを作成" 
            />
        </EventButtonPrimary>
    );
};

export default CreateAccountContent