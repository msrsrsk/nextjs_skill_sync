"use client"

import { useEffect } from "react"
import { useFormStatus } from "react-dom"

import FormLabel from "@/components/common/forms/FormLabel"
import FormInput from "@/components/common/forms/FormInput"
import FormErrorText from "@/components/common/forms/FormErrorText"
import PendingContent from "@/components/common/buttons/PendingContent"
import Modal from "@/components/common/modals/Modal"
import useNameValidation from "@/hooks/validation/useNameValidation"
import { EventButtonPrimary } from "@/components/common/buttons/Button"
import { BUTTON_TEXT_TYPES } from "@/constants/index"

const { BUTTON_JA } = BUTTON_TEXT_TYPES;

interface EditNameBoxProps extends ModalStateProps {
    optimisticName: {
        lastname: UserLastname;
        firstname: UserFirstname;
    };
    onConfirm: (formData: FormData) => void;
}

const EditNameBox = ({ 
    optimisticName,
    modalActive,
    setModalActive,
    onConfirm,
}: EditNameBoxProps) => {
    const {
        lastName,
        firstName,
        setLastName,
        setFirstName,
        errorList,
        isValid,
        handleLastNameChange,
        handleFirstNameChange,
        validateName
    } = useNameValidation();

    const handleFormSubmit = () => {
        const formData = new FormData();
        formData.append('lastname', lastName);
        formData.append('firstname', firstName);
        onConfirm(formData);
    }

    useEffect(() => {
        if (modalActive) {
            setLastName(optimisticName.lastname);
            setFirstName(optimisticName.firstname);
        }
        validateName(optimisticName.lastname, optimisticName.firstname);
    }, [modalActive]);

    return (
        <Modal
            modalActive={modalActive}
            setModalActive={setModalActive}
        >
            <p className="account-modal-title">新しいお名前を入力してください</p>

            <form className="pl-[2px]">
                <div>
                    <FormLabel 
                        name="name" 
                        label="お名前" 
                    />
                    <div className="form-namebox">
                        <FormInput 
                            name="lastname" 
                            type="text" 
                            value={lastName}
                            placeholder="姓" 
                            onChange={handleLastNameChange}
                            error={errorList}
                            customClass="bg-form-bg"
                        />
                        <FormInput 
                            name="firstname" 
                            type="text" 
                            value={firstName}
                            placeholder="名" 
                            onChange={handleFirstNameChange}
                            error={errorList}
                            customClass="bg-form-bg"
                        />
                    </div>
                    <FormErrorText errorList={errorList} />
                </div>

                <SaveButton 
                    isValid={isValid} 
                    handleFormSubmit={handleFormSubmit}
                />
            </form>
        </Modal>
    )
}

const SaveButton = ({ isValid, handleFormSubmit }: EditButtonProps) => {
    const { pending } = useFormStatus();

    return (
        <EventButtonPrimary
            customClass="button-space-default"
            text={BUTTON_JA}
            disabled={pending || !isValid}
            onClick={handleFormSubmit}
        >
            <PendingContent pending={pending} text="保存する" />
        </EventButtonPrimary>
    )
}

export default EditNameBox