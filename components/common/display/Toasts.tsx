import { toast } from "react-hot-toast";
import { CircleX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { fadeInToast } from "@/lib/motion"
import { CheckIcon, AlertIcon } from "@/components/common/icons/SvgIcons"

interface ToastProps {
    visible: boolean;
    id: string;
}

const toastWrapper = (
    children: React.ReactNode, 
    customClass: string
) => {
    const Component = (t: ToastProps) => (
        <AnimatePresence>
            <motion.div 
                className={customClass}
                initial="hidden"
                animate={t.visible ? "show" : "hidden"}
                exit="hidden"
                variants={fadeInToast()}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
    return Component;
};

export const showSuccessToast = (message: string) => {
    toast.custom(
        toastWrapper(
            <>
                <CheckIcon customClass="toast-icon" color="#39CC6F" />
                <span>{message}</span>
            </>,
            "toast-item bg-[#E3F2E9] text-tag-voices border border-tag-voices"
        ),
        { duration: 3000 }
    );
};

export const showErrorToast = (message: string) => {
    toast.custom(
        toastWrapper(
            <>
                <AlertIcon customClass="toast-icon" />
                <span>{message}</span>
            </>,
            "toast-item bg-[#F0DFDF] text-tag-default border border-tag-default"
        ),
        { duration: 4000 }
    );
};

export const showCustomToast = (children: React.ReactNode): string => {
    return toast.custom((t: ToastProps) => (
        <AnimatePresence>
            <motion.div 
                className="max-w-[336px] md:max-w-sm w-full flex flex-col items-center justify-center gap-3 md:gap-4 rounded-sm drop-shadow-toast-sp md:drop-shadow-toast bg-soft-white border border-tag-voices pt-6 px-4 pb-7 md:pb-8"
                initial="hidden"
                animate={t.visible ? "show" : "hidden"}
                exit="hidden"
                variants={fadeInToast()}
            >
                {children}
                <button 
                    onClick={() => toast.dismiss(t.id)} 
                    className="close-button"
                    aria-label="ポップアップを閉じる"
                >
                    <CircleX className="close-button-icon" />
                </button>
            </motion.div>
        </AnimatePresence>
    ), { duration: Infinity });
};