"use client"

import { useFormStatus } from "react-dom"
import { receiveContactEmail } from "@/lib/services/email/contact"

import ContactStatus from "@/components/common/forms/ContactStatus"
import UploadedFileList from "@/components/ui/form/UploadedFileList"
import PendingContent from "@/components/common/buttons/PendingContent"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import useAuth from "@/hooks/auth/useAuth"
import { EventButtonPrimary, EventButtonSecondary } from "@/components/common/buttons/Button"
import { CONTACT_FORM_STEP, BUTTON_TEXT_TYPES, BUTTON_TYPES, CONTACT_STEPS } from "@/constants/index"

const { CONTACT_FORM, CONTACT_THANKS } = CONTACT_FORM_STEP;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { SUBMIT_TYPE } = BUTTON_TYPES;
const { CONFIRM } = CONTACT_STEPS;

interface ContactCheckProps {
    setContactStep: (step: string) => void;
    lastName: string;
    firstName: string;
    email: string;
    textarea: string;
    files: Files;
}

const ContactCheck = ({ 
    setContactStep, 
    lastName, 
    firstName, 
    email, 
    textarea,
    files, 
}: ContactCheckProps) => {
    const { user, loading, isAuthenticated } = useAuth();

    const handleSubmit = async (formData: FormData) => {
        files.forEach((file) => formData.append('files', file));
        
        const result = await receiveContactEmail(formData);
        
        if (result.success) {
            setContactStep(CONTACT_THANKS);
        } else {
            console.error('送信エラー:', result.error);
        }
    };

    return (
        <div className="contact-form-wrapper">
            <ContactStatus activeStep={CONFIRM} />

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div>
                    <div className="bg-soft-white rounded-sm pt-6 px-5 pb-7 md:px-10 grid gap-5 md:gap-7">
                        <div>
                            <h3 className="contact-check-label">
                                お名前
                            </h3>
                            <p className="contact-check-text">
                                {lastName} {firstName}
                            </p>
                        </div>
                        <div>
                            <h3 className="contact-check-label">
                                メールアドレス
                            </h3>
                            <p className="contact-check-text">
                                {email}
                            </p>
                        </div>
                        <div>
                            <h3 className="contact-check-label">
                                お問い合わせ内容
                            </h3>
                            <p className="contact-check-text">
                                {textarea}
                            </p>
                        </div>
                        <div>
                            <h3 className="contact-check-label">
                                添付ファイル
                            </h3>
                            <div>
                                {files?.length > 0 ? (
                                    files.map((file) => (
                                        <UploadedFileList key={file.name} file={file} />
                                    ))
                                ) : (
                                    <p className="contact-check-text">なし</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <form action={handleSubmit}>
                        <input type="hidden" name="lastName" value={lastName} />
                        <input type="hidden" name="firstName" value={firstName} />
                        <input type="hidden" name="email" value={email} />
                        <input type="hidden" name="message" value={textarea} />

                        {isAuthenticated && <>
                            <input type="hidden" name="userId" value={user?.id} />
                            <input type="hidden" name="userName" value={user?.name} />
                        </>}

                        <div className="button-space-default flex items-center gap-6 md:gap-8 justify-center">
                            <EventButtonSecondary
                                onClick={() => setContactStep(CONTACT_FORM)}
                                text={BUTTON_JA}
                            >
                                戻る
                            </EventButtonSecondary>
                            
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
        <EventButtonPrimary
            type={SUBMIT_TYPE}
            text={BUTTON_JA}
            disabled={pending}
        >
            <PendingContent pending={pending} text="送信する" />
        </EventButtonPrimary>
    )
}

export default ContactCheck