import { convertToJST, formatDateCommon } from "@/lib/utils/format"
import { 
    ORDER_STATUS, 
    ORDER_HISTORY_CATEGORIES,
    PAYMENT_DUE_DATE,
    DATE_FORMAT_TYPES,
    DATE_FORMAT_CONFIG,
    ORDER_NUMBER_PADDING
} from "@/constants/index"
import { PAYMENT_ERROR_MAP } from "@/constants/error"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { 
    ORDER_PENDING, 
    ORDER_PROCESSING, 
    ORDER_SHIPPED, 
    ORDER_DELIVERED, 
    ORDER_CANCELED, 
    ORDER_REFUNDED 
} = ORDER_STATUS;
const { 
    CATEGORY_NOT_SHIPPED, 
    CATEGORY_SHIPPED 
} = ORDER_HISTORY_CATEGORIES;
const { DATE_DOT, DATE_SLASH } = DATE_FORMAT_TYPES;
const { PADDING_LENGTH, TIMESTAMP_MULTIPLIER } = DATE_FORMAT_CONFIG;

export const formatOrderNumber = (
    orderNumber: number, 
    prefix: string = 'ODR', 
    padding: number = ORDER_NUMBER_PADDING
): string => {
    const paddedNumber = orderNumber.toString().padStart(padding, '0');
    return `#${prefix}-${paddedNumber}`;
}

export const formatOrderStatus = (status: OrderStatus): string => {
    const statusMap = {
        [ORDER_PENDING]: '保留中',
        [ORDER_PROCESSING]: CATEGORY_NOT_SHIPPED,
        [ORDER_SHIPPED]: CATEGORY_SHIPPED,
        [ORDER_DELIVERED]: '配送完了',
        [ORDER_CANCELED]: 'キャンセル',
        [ORDER_REFUNDED]: '返金済み',
    }
    
    return statusMap[status] || status;
}

export const formatPaymentMethodType = (paymentMethodType: string): string => {
    const methodMap = {
        'card': 'クレジットカード',
        'customer_balance': '銀行振込',
        'konbini': 'コンビニ決済',
        'bank_transfer': '銀行口座引き落とし',
        'paypay': 'PayPay決済',
    }

    return methodMap[paymentMethodType as keyof typeof methodMap] || paymentMethodType;
}

export const formatPaymentStatus = (status: OrderStatus): string => {
    const statusMap = {
        [ORDER_PENDING]: '未払い',
        [ORDER_CANCELED]: 'キャンセル',
        [ORDER_REFUNDED]: '返金済み',
        [ORDER_PROCESSING]: '支払い済み',
        [ORDER_SHIPPED]: '支払い済み',
        [ORDER_DELIVERED]: '支払い済み',
    }

    return statusMap[status] || '不明なステータス';
}

export const formatPaymentCardBrand = (cardBrand?: string | null): string => {
    if (!cardBrand) return 'クレジットカード';

    const brandMap = {
        'card': 'クレジットカード',
        'visa': 'クレジットカード（VISA）',
        'mastercard': 'クレジットカード（Mastercard）',
        'amex': 'クレジットカード（American Express）',
        'jcb': 'クレジットカード（JCB）',
        'discover': 'クレジットカード（Discover）',
        'diners': 'クレジットカード（Diners Club）',
        'unionpay': 'クレジットカード（UnionPay）',
    }

    return brandMap[cardBrand as keyof typeof brandMap] || cardBrand;
}

export const formatOrderDateTime = (
    timestamp: number, 
    type: DateFormatType = DATE_DOT
): string => {
    const date = new Date(timestamp * TIMESTAMP_MULTIPLIER); // timestamp が秒単位の Unix timestamp のため1000倍
    const convertedDate = convertToJST(date);
    const datePart = formatDateCommon(convertedDate, type);
    
    const hours = String(date.getHours()).padStart(PADDING_LENGTH, '0');
    const minutes = String(date.getMinutes()).padStart(PADDING_LENGTH, '0');
    
    return `${datePart} ${hours}:${minutes}`;
}

export const formatPaymentDueDate = (timestamp: number): string => {
    const dueDate = new Date(timestamp * TIMESTAMP_MULTIPLIER + PAYMENT_DUE_DATE);
    return formatDateCommon(dueDate, DATE_SLASH);
}

export const getPaymentErrorDetails = (errorType: string): string => {
    const errorKey = PAYMENT_ERROR_MAP[errorType];
    return errorKey ? ERROR_MESSAGES.PAYMENT_ERROR[errorKey] : ERROR_MESSAGES.PAYMENT_ERROR.UNKNOWN;
}