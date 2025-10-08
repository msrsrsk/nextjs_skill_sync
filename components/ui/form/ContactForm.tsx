import ContactStatus from "@/components/common/forms/ContactStatus"
import FormLabel from "@/components/common/forms/FormLabel"
import FormInput from "@/components/common/forms/FormInput"
import FormErrorText from "@/components/common/forms/FormErrorText"
import FormTextarea from "@/components/common/forms/FormTextarea"
import DropZone from "@/components/ui/form/DropZone"
import { EventButtonPrimary } from "@/components/common/buttons/Button"
import { CONTACT_FORM_STEP, BUTTON_TEXT_TYPES, DROPZONE_TYPES, CONTACT_STEPS } from "@/constants/index"

const { CONTACT_CHECK } = CONTACT_FORM_STEP;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { DROPZONE_CONTACT } = DROPZONE_TYPES;
const { INPUT } = CONTACT_STEPS;

interface ContactFormProps {
    lastName: string;
    firstName: string;
    email: string;
    textarea: string;
    files: Files;
    setFiles: React.Dispatch<React.SetStateAction<Files>>;
    nameErrorList: string[];
    emailErrorList: string[];
    textareaErrorList: string[];
    handleLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    isValid: boolean;
    setContactStep: (step: ContactFormStepType) => void;
}

const ContactForm = ({ 
    lastName,
    firstName,
    email,
    textarea,
    files, 
    setFiles, 
    nameErrorList, 
    emailErrorList, 
    textareaErrorList, 
    handleLastNameChange, 
    handleFirstNameChange, 
    handleEmailChange, 
    handleTextareaChange, 
    isValid,
    setContactStep
}: ContactFormProps) => {
    return (
        <div className="contact-form-wrapper">
            <ContactStatus activeStep={INPUT} />

            <div>
                <div className="form-box">
                    <div>
                        <FormLabel 
                            name="name" 
                            label="お名前" 
                            required
                        />
                        <div className="form-namebox">
                            <FormInput 
                                name="name" 
                                type="text" 
                                value={lastName ? lastName : ''}
                                placeholder="姓" 
                                onChange={handleLastNameChange}
                                error={nameErrorList}
                                customClass="bg-form-bg"
                            />
                            <FormInput 
                                name="name" 
                                type="text" 
                                value={firstName ? firstName : ''}
                                placeholder="名" 
                                onChange={handleFirstNameChange}
                                error={nameErrorList}
                                customClass="bg-form-bg"
                            />
                        </div>
                        <FormErrorText errorList={nameErrorList} />
                    </div>
                    <div>
                        <FormLabel 
                            name="email" 
                            label="メールアドレス" 
                            required
                        />
                        <FormInput 
                            name="email" 
                            type="text" 
                            value={email ? email : ''}
                            placeholder="your-email@example.com" 
                            onChange={handleEmailChange}
                            error={emailErrorList}
                            customClass="bg-form-bg"
                        />
                        <FormErrorText errorList={emailErrorList} />
                    </div>
                    <div>
                        <FormLabel 
                            name="message" 
                            label="お問い合わせ内容" 
                            required
                        />
                        <FormTextarea 
                            name="textarea" 
                            value={textarea ? textarea : ''}
                            placeholder="ここにメッセージをご入力ください" 
                            onChange={handleTextareaChange}
                            error={textareaErrorList}
                            customClass="h-[200px] bg-form-bg"
                        />
                        <FormErrorText errorList={textareaErrorList} />
                    </div>
                    <div>
                        <FormLabel name="file" label="添付ファイル" />
                        <DropZone 
                            files={files}
                            setFiles={setFiles}
                            type={DROPZONE_CONTACT}
                        />
                    </div>
                </div>
                <EventButtonPrimary
                    onClick={() => setContactStep(CONTACT_CHECK)}
                    customClass="button-space-default"
                    text={BUTTON_JA}
                    disabled={!isValid}
                >
                    確認する
                </EventButtonPrimary>
            </div>
        </div>
    )
}

export default ContactForm