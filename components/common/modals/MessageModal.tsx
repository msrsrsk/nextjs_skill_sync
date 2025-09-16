import Modal from "@/components/common/modals/Modal"
import congrats from"@/data/congrats.json"
import LottieAnimation from "@/components/ui/display/LottieAnimation"
import usePreventScroll from "@/hooks/utils/usePreventScroll"
import { EventButtonSecondary } from "@/components/common/buttons/Button"
import { BUTTON_TEXT_TYPES, MODAL_SIZES } from "@/constants/index"

const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { MODAL_SMALL } = MODAL_SIZES;

interface MessageModalProps extends ModalStateProps {
    text: string;
    confetti?: boolean;
}

const MessageModal = ({ 
    text, 
    confetti = false,
    modalActive, 
    setModalActive, 
}: MessageModalProps) => {
    usePreventScroll(modalActive);

    return (
        <Modal
            size={MODAL_SMALL}
            modalActive={modalActive}
            setModalActive={setModalActive}
        >
            <p className="modal-text whitespace-pre-line">{text}</p>
            {confetti && 
                <LottieAnimation 
                    data={congrats} 
                    customClass="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                />
            }

            <EventButtonSecondary
                onClick={() => setModalActive(false)}
                text={BUTTON_JA}
                customClass="relative z-10"
            >
                閉じる
            </EventButtonSecondary>
        </Modal>
    )
}

export default MessageModal