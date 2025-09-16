import { motion } from "framer-motion"

import { fadeInUp } from "@/lib/motion"

interface FadeInUpContainerProps {
    children: React.ReactNode
    animationKey: string
}

const FadeInUpContainer = ({ 
    children,
    animationKey 
}: FadeInUpContainerProps) => {
    return (
        <motion.div 
            key={animationKey}
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={fadeInUp()}
        >
            {children}
        </motion.div>
    )
}

export default FadeInUpContainer