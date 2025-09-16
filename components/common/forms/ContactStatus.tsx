import { CONTACT_STATUS } from "@/data"
import { CONTACT_STEP_OFFSET } from "@/constants/index"

const ContactStatus = ({ 
    activeStep 
}: { activeStep: ContactStepsType }) => {
    return (
        <div className="contact-step-container">
            {CONTACT_STATUS.map((status, index) => (
                <div className="contact-step-box" key={index}>
                    <span className={`contact-step-number${
                        index === activeStep ? ' is-active' : ''
                    }`}>
                        {index + CONTACT_STEP_OFFSET}
                    </span>
                    <p className="contact-step-text">{status}</p>
                </div>
            ))}
        </div>
    )
}

export default ContactStatus