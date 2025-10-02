import { motion, AnimatePresence } from "framer-motion"
import { CircleX } from "lucide-react"

import Overlay from "@/components/common/display/Overlay"
import usePreventScroll from "@/hooks/utils/usePreventScroll"
import { fadeScale } from "@/lib/utils/motion"
import { MODAL_SIZES } from "@/constants/index"

const { MODAL_MEDIUM } = MODAL_SIZES;

interface ModalProps extends ModalStateProps {
    children: React.ReactNode;
    size?: ModalSizeType;
}

const Modal = ({ 
    children, 
    size = MODAL_MEDIUM, 
    modalActive, 
    setModalActive 
}: ModalProps) => {
    usePreventScroll(modalActive);

    const isMedium = size === MODAL_MEDIUM;

    return (
        <AnimatePresence mode="wait">
            {modalActive && (
                <div>
                    <div className="modal-container">
                        <motion.div 
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            variants={fadeScale()}
                            className={`modal-inner rounded-md md:rounded-sm py-8 md:pt-10 md:pb-[34px]${size === 'small' ? ' max-w-xs px-5 md:px-10' : ' max-w-md pl-5 pr-1 md:pl-10 md:pr-2 flex flex-col'}`}
                        >
                            <div className={`${
                                isMedium ? 'overflow-y-auto flex-1 pr-4 md:pr-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-sub [&::-webkit-scrollbar-thumb]:rounded-full' : ''
                            }`}>
                                {children}
                                {isMedium && (
                                    <button 
                                        onClick={() => setModalActive(false)} 
                                        className="close-button"
                                        aria-label="モーダルを閉じる"
                                    >
                                        <CircleX className="close-button-icon" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                    <Overlay 
                        isActive={modalActive} 
                        setActive={setModalActive}
                    />
                </div>
            )}
        </AnimatePresence>
    )
}

export default Modal
