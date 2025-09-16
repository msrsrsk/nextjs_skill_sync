"use client"

import { useState } from "react"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import ContactForm from "@/components/ui/form/ContactForm"
import ContactCheck from "@/components/ui/form/ContactCheck"
import ContactThanks from "@/components/ui/form/ContactThanks"
import useNameValidation from "@/hooks/validation/useNameValidation"
import useEmailValidation from "@/hooks/validation/useEmailValidation"
import useTextareaValidation from "@/hooks/validation/useTextareaValidation"
import usePageScrollReset from "@/hooks/layout/usePageScrollReset"
import { CONTACT_FORM_STEP } from "@/constants/index"

const { CONTACT_FORM, CONTACT_CHECK, CONTACT_THANKS } = CONTACT_FORM_STEP;

const ContactPage = () => {
    const [contactStep, setContactStep] = useState(CONTACT_FORM);
    const [files, setFiles] = useState<File[]>([]);
    
    const { 
        firstName, 
        lastName, 
        errorList: nameErrorList, 
        isValid: nameIsValid, 
        handleLastNameChange, 
        handleFirstNameChange 
    } = useNameValidation();
    const { 
        email, 
        errorList: emailErrorList, 
        isValid: emailIsValid, 
        handleEmailChange 
    } = useEmailValidation();
    const { 
        textarea, 
        errorList: textareaErrorList, 
        isValid: textareaIsValid, 
        handleTextareaChange 
    } = useTextareaValidation();

    usePageScrollReset({
        dependencies: [contactStep],
        condition: !!contactStep
    });

    const isValid = nameIsValid && emailIsValid && textareaIsValid;

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Contact" 
                customClass="mt-6 mb-10 md:mt-10 md:mb-[56px]" 
            />

            <div className="max-w-sm mx-auto">
                {contactStep === CONTACT_FORM && (
                    <ContactForm 
                        lastName={lastName}
                        firstName={firstName}
                        email={email}
                        textarea={textarea}
                        files={files} 
                        setFiles={setFiles} 
                        nameErrorList={nameErrorList}
                        emailErrorList={emailErrorList}
                        textareaErrorList={textareaErrorList}
                        handleLastNameChange={handleLastNameChange}
                        handleFirstNameChange={handleFirstNameChange}
                        handleEmailChange={handleEmailChange} 
                        handleTextareaChange={handleTextareaChange}
                        isValid={isValid}
                        setContactStep={setContactStep}
                    />
                )}
                {contactStep === CONTACT_CHECK && (
                    <ContactCheck 
                        setContactStep={setContactStep}
                        lastName={lastName}
                        firstName={firstName}
                        email={email}
                        textarea={textarea}
                        files={files}
                    />
                )}
                {contactStep === CONTACT_THANKS && (
                    <ContactThanks />
                )}
            </div>
        </div>
    </>
}

export default ContactPage