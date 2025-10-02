import { AnimatePresence, motion } from "framer-motion"

import { fadeIn } from "@/lib/utils/motion"

const FormErrorText = ({ errorList }: { errorList: string[] }) => {
    return (
        <AnimatePresence>
            {errorList.map((error, index) => (
                <motion.div 
                    key={error}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    variants={fadeIn()}
                >
                    <p key={index} className="error-message">
                        {error}
                    </p>
                </motion.div>
            ))}
        </AnimatePresence>
    )
}

export default FormErrorText