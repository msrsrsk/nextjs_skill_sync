type ErrorMapType = Record<string, PaymentErrorType>

export const PAYMENT_ERROR_MAP: ErrorMapType = {
    'card_declined': 'CARD_DECLINED',
    'expired_card': 'EXPIRED_CARD',
    'incorrect_cvc': 'INCORRECT_CVC',
    'processing_error': 'PROCESSING_ERROR',
    'rate_limit': 'RATE_LIMIT',
    'authentication_required': 'AUTHENTICATION_REQUIRED',
    'insufficient_funds': 'INSUFFICIENT_FUNDS',
    'card_not_supported': 'CARD_NOT_SUPPORTED',
    'currency_not_supported': 'CURRENCY_NOT_SUPPORTED',
    'fraudulent': 'FRAUDULENT',
    'lost_card': 'LOST_CARD',
    'stolen_card': 'STOLEN_CARD',
    'generic_decline': 'GENERIC_DECLINE',
    'do_not_honor': 'DO_NOT_HONOR',
    'call_issuer': 'CALL_ISSUER',
    'pickup_card': 'PICKUP_CARD',
    'invalid_amount': 'INVALID_AMOUNT',
    'duplicate_transaction': 'DUPLICATE_TRANSACTION',
    'card_velocity_exceeded': 'CARD_VELOCITY_EXCEEDED',
    'unknown': 'UNKNOWN',
}