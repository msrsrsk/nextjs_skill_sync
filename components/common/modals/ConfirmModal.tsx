"use client"

import { useFormStatus } from "react-dom"

import Modal from "@/components/common/modals/Modal"
import PendingContent from "@/components/common/buttons/PendingContent"
import usePreventScroll from "@/hooks/utils/usePreventScroll"
import { EventButtonPrimary, EventButtonSecondary } from "@/components/common/buttons/Button"
import { BUTTON_TEXT_TYPES, BUTTON_TYPES, MODAL_SIZES } from "@/constants/index"

const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { SUBMIT_TYPE } = BUTTON_TYPES;
const { MODAL_SMALL } = MODAL_SIZES;

interface ConfirmModalProps extends ModalStateProps {
    text: string | React.ReactNode;
    onConfirm: () => void | Promise<any>; 
}

const ConfirmModal = ({ 
    text, 
    modalActive, 
    setModalActive, 
    onConfirm 
}: ConfirmModalProps) => {
    usePreventScroll(modalActive);

    return (
        <Modal
            size={MODAL_SMALL}
            modalActive={modalActive}
            setModalActive={setModalActive}
        >
            <p className="modal-text">{text}</p>

            <form action={onConfirm} className="modal-button-box">
                <EventButtonSecondary
                    onClick={() => setModalActive(false)}
                    text={BUTTON_JA}
                >
                    いいえ
                </EventButtonSecondary>
                <SubmitButton />
            </form>
        </Modal>
    )
}

const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
        <EventButtonPrimary
            text={BUTTON_JA}
            type={SUBMIT_TYPE}
            disabled={pending}
        >
            <PendingContent pending={pending} text="はい" />
        </EventButtonPrimary>
    )
}

export default ConfirmModal