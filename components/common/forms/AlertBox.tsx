"use client"

import { AnimatePresence, motion } from "framer-motion"
import { CircleAlert } from "lucide-react"

import { fadeIn } from "@/lib/utils/motion"

interface AlertBoxProps {
    message: string;
    showError: boolean;
}

const AlertBox = ({ 
    message, 
    showError,
}: AlertBoxProps) => {
    const isShow = message && showError;

    return <>
        <AnimatePresence mode="wait">
            {isShow && (
                <motion.div 
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    variants={fadeIn()}
                    className="alert-box"
                >
                    <CircleAlert 
                        className="alert-icon" 
                        strokeWidth={2.0} 
                    />
                    <p className="alert-text">{message}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </>
}

export default AlertBox