"use client"

import { useFormStatus } from "react-dom"

import PageTitle from "@/components/common/display/PageTitle"
import FormLabel from "@/components/common/forms/FormLabel"
import FormInput from "@/components/common/forms/FormInput"
import FormErrorText from "@/components/common/forms/FormErrorText"
import PendingContent from "@/components/common/buttons/PendingContent"
import useEmailValidation from "@/hooks/validation/useEmailValidation"
import useResetValue from "@/hooks/utils/useResetValue"
import useToastNotifications from "@/hooks/notification/useToastNotifications"
import { EventButtonPrimary } from "@/components/common/buttons/Button"
import { BUTTON_TEXT_TYPES, BUTTON_TYPES } from "@/constants/index"

const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { SUBMIT_TYPE } = BUTTON_TYPES;

interface EmailCheckContentProps {
    title: string;
    description: React.ReactNode;
    formAction: (formData: FormData) => void;
    errorMessage: string | null;
    timestamp: number;
}

const EmailCheckContent = ({
    title,
    description,
    formAction,
    errorMessage,
    timestamp,
}: EmailCheckContentProps) => {
    const { 
        email,
        errorList: emailErrorList, 
        isValid: emailIsValid, 
        handleEmailChange,
        resetEmail
    } = useEmailValidation();

    useResetValue({
        watchValue: errorMessage !== null,
        resetFunctions: [resetEmail]
    });

    useToastNotifications({
        error: errorMessage,
        timestamp: timestamp
    });

    return <>
        <PageTitle 
            title={title} 
            customClass="mt-6 mb-8 md:my-10" 
        />

        <p className="page-description">{description}</p>

        <div className="max-w-sm mx-auto">
            <form action={formAction}>
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

                <SubmitButton isValid={emailIsValid} />
            </form>
        </div>
    </>
}

const SubmitButton = ({ isValid }: { isValid: boolean }) => {
    const { pending } = useFormStatus();

    return (
        <EventButtonPrimary
            customClass="button-space-default"
            text={BUTTON_JA}
            type={SUBMIT_TYPE}
            disabled={!isValid || pending}
        >
            <PendingContent pending={pending} text="送信する" />
        </EventButtonPrimary>
    );
};

export default EmailCheckContent