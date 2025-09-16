import { ERROR_MESSAGE_POSITIONS } from "@/constants/index"

const { ERROR_CENTER } = ERROR_MESSAGE_POSITIONS;

interface ErrorMessageProps {
    message: string;
    position?: ErrorMessagePositionType;
}

const ErrorMessage = ({ 
    message, 
    position = ERROR_CENTER 
}: ErrorMessageProps) => {
    return (
        <p className={`attention-text whitespace-pre-line${
            position === ERROR_CENTER ? ' text-center' : ''
        }`}>
            {message}
        </p>
    )
}

export default ErrorMessage