"use client"

import { useEffect } from "react"
import { useFormStatus } from "react-dom"

import FormLabel from "@/components/common/forms/FormLabel"
import FormInput from "@/components/common/forms/FormInput"
import FormErrorText from "@/components/common/forms/FormErrorText"
import PendingContent from "@/components/common/buttons/PendingContent"
import Modal from "@/components/common/modals/Modal"
import useTelValidation from "@/hooks/validation/useTelValidation"
import { EventButtonPrimary } from "@/components/common/buttons/Button"
import { BUTTON_TEXT_TYPES } from "@/constants/index"

const { BUTTON_JA } = BUTTON_TEXT_TYPES;

interface EditTelBoxProps extends ModalStateProps {
    optimisticTel: UserTel;
    onConfirm: (formData: FormData) => void;
}

const EditTelBox = ({ 
    optimisticTel,
    modalActive,
    setModalActive,
    onConfirm,
}: EditTelBoxProps) => {
    const { 
        tel,
        setTel,
        errorList, 
        isValid, 
        handleTelChange,
        validateTel
    } = useTelValidation();

    const handleFormSubmit = () => {
        const formData = new FormData();
        formData.append('tel', tel);
        onConfirm(formData);
    }

    useEffect(() => {
        if (modalActive && optimisticTel) {
            setTel(optimisticTel);
            validateTel(optimisticTel);
        }
    }, [modalActive]);

    return (
        <Modal
            modalActive={modalActive}
            setModalActive={setModalActive}
        >
            <p className="account-modal-title">新しい電話番号を入力してください</p>

            <form className="pl-[2px]">
                <div>
                    <FormLabel 
                        name="tel" 
                        label="電話番号" 
                    />
                    <FormInput 
                        name="tel" 
                        type="text" 
                        value={tel}
                        placeholder="00-0000-0000" 
                        onChange={handleTelChange}
                        error={errorList}
                        customClass="bg-form-bg"
                    />
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
            text={BUTTON_JA}
            customClass="button-space-default"
            disabled={pending || !isValid}
            onClick={handleFormSubmit}
        >
            <PendingContent pending={pending} text="保存する" />
        </EventButtonPrimary>
    )
}

export default EditTelBox