import { useEffect } from "react"
import { showSuccessToast, showErrorToast } from "@/components/common/display/Toasts"

interface UseToastNotificationsProps {
    success?: boolean;
    successMessage?: string;
    error?: string | null;
    timestamp?: number;
}

const useToastNotifications = ({ 
    success, 
    successMessage,
    error, 
    timestamp,
}: UseToastNotificationsProps) => {
    useEffect(() => {
        if (success && successMessage) {
            showSuccessToast(successMessage);
        }
        if (error) {
            showErrorToast(error);
        }
    }, [success, successMessage, error, timestamp]);
}

export default useToastNotifications