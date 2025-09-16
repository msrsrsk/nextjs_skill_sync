import { PAYMENT_ERROR_MAP } from "@/constants/error"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

export const getPaymentErrorDetails = (errorType: string): string => {
    const errorKey = PAYMENT_ERROR_MAP[errorType];
    return errorKey ? ERROR_MESSAGES.PAYMENT_ERROR[errorKey] : ERROR_MESSAGES.PAYMENT_ERROR.UNKNOWN;
};