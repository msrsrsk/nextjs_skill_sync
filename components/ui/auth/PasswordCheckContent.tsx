"use client"

import { useFormStatus } from "react-dom"
import { useSearchParams } from "next/navigation"  

import FormLabel from "@/components/common/forms/FormLabel"
import FormPassword from "@/components/common/forms/FormPassword"
import FormErrorText from "@/components/common/forms/FormErrorText"
import PendingContent from "@/components/common/buttons/PendingContent"
import useDoublePasswordValidation from "@/hooks/validation/useDoublePasswordValidation"
import useResetValue from "@/hooks/utils/useResetValue"
import useUpdatePasswordForm from "@/hooks/form/useUpdatePasswordForm"
import useToastNotifications from "@/hooks/notification/useToastNotifications"
import { EventButtonPrimary } from "@/components/common/buttons/Button"
import { 
    UPDATE_PASSWORD_PAGE_TYPES, 
    BUTTON_TEXT_TYPES, 
    BUTTON_TYPES,
} from "@/constants/index"

const { RESET_PASSWORD_PAGE } = UPDATE_PASSWORD_PAGE_TYPES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { SUBMIT_TYPE } = BUTTON_TYPES;

const PasswordCheckContent = ({ type }: { type: UpdatePasswordPageType }) => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token'); 

    const {
        password,
        confirmPassword,
        isRevealPassword,
        isRevealConfirmPassword,
        setIsRevealPassword,
        setIsRevealConfirmPassword,
        errorList,
        errorListConfirm,
        isValid,
        handlePasswordChange,
        handleConfirmPasswordChange,
        resetPassword
    } = useDoublePasswordValidation();

    const {
        errorMessage,
        timestamp,
        updateFormAction,
    } = useUpdatePasswordForm(type);

    useResetValue({
        watchValue: errorMessage !== null,
        resetFunctions: [resetPassword]
    });

    useToastNotifications({
        error: errorMessage,
        timestamp,
    });

    return <>
        <p className="page-description">
            ※パスワードは半角英字、数字、記号を<br />
            組み合わせた 8~30 文字で入力してください
        </p>

        <div className="max-w-sm mx-auto">
            <form action={updateFormAction}>
                <div className="form-box">
                    <div>
                        <FormLabel 
                            name="newPassword" 
                            label="新しいパスワード" 
                        />
                        <FormPassword 
                            name="newPassword"
                            value={password}
                            isRevealPassword={isRevealPassword}
                            setIsRevealPassword={setIsRevealPassword}
                            onChange={handlePasswordChange}
                            error={errorList}
                            customClass="bg-soft-white"
                        />
                        <FormErrorText errorList={errorList} />
                    </div>
                    <div>
                        <FormLabel 
                            name="confirmPassword" 
                            label="新しいパスワード（確認用）" 
                        />
                        <FormPassword 
                            name="confirmPassword"
                            value={confirmPassword}
                            isRevealPassword={isRevealConfirmPassword}
                            setIsRevealPassword={setIsRevealConfirmPassword}
                            onChange={handleConfirmPasswordChange}
                            error={errorListConfirm}
                            customClass="bg-soft-white"
                        />
                        <FormErrorText errorList={errorListConfirm} />
                    </div>
                </div>

                {token && type === RESET_PASSWORD_PAGE && 
                    <input type="hidden" name="token" value={token} />
                }

                <SaveButton isValid={isValid} />
            </form>
        </div>
    </>
}

const SaveButton = ({ isValid }: { isValid: boolean }) => {
    const { pending } = useFormStatus();

    return (
        <EventButtonPrimary
            customClass="button-space-default"
            text={BUTTON_JA}
            type={SUBMIT_TYPE}
            disabled={!isValid || pending}
        >
            <PendingContent pending={pending} text="保存する" />
        </EventButtonPrimary>
    );
};

export default PasswordCheckContent