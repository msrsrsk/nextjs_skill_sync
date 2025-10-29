import { describe, it, expect, vi, beforeEach } from "vitest"

import { 
    formatOrderNumber,
    formatOrderStatus,
    formatPaymentMethodType,
    formatPaymentStatus,
    formatPaymentCardBrand,
    formatOrderDateTime,
    formatPaymentDueDate,
    getPaymentErrorDetails
} from "@/services/order/format"
import { convertToJST, formatDateCommon } from "@/lib/utils/format"
import { ORDER_STATUS, ORDER_HISTORY_CATEGORIES, DATE_FORMAT_CONFIG, DATE_FORMAT_TYPES, PAYMENT_DUE_DATE } from "@/constants/index"

const { TIMESTAMP_MULTIPLIER } = DATE_FORMAT_CONFIG;
const { DATE_DOT, DATE_SLASH } = DATE_FORMAT_TYPES;
const { ORDER_PENDING, ORDER_PROCESSING, ORDER_SHIPPED, ORDER_DELIVERED, ORDER_CANCELED, ORDER_REFUNDED } = ORDER_STATUS;
const { CATEGORY_NOT_SHIPPED, CATEGORY_SHIPPED } = ORDER_HISTORY_CATEGORIES;

vi.mock('@/lib/utils/format', () => ({
    convertToJST: vi.fn(),
    formatDateCommon: vi.fn()
}))

/* ==================================== 
    formatOrderNumber Test
==================================== */
describe('formatOrderNumber', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // デフォルトパラメータでの基本テスト
    it('should format order number with default parameters', () => {
        const result = formatOrderNumber(123)
        expect(result).toBe('#ODR-000123')
    })

    // カスタムプレフィックスのテスト
    it('should format with custom prefix', () => {
        const result = formatOrderNumber(123, 'TEST')
        expect(result).toBe('#TEST-000123')
    })

    // カスタムパディングのテスト
    it('should format with custom padding', () => {
        const result = formatOrderNumber(123, 'ODR', 8)
        expect(result).toBe('#ODR-00000123')
    })

    // 全てのパラメータをカスタム指定
    it('should format with all custom parameters', () => {
        const result = formatOrderNumber(456, 'CUSTOM', 4)
        expect(result).toBe('#CUSTOM-0456')
    })

    // 境界値テスト
    it('should handle zero order number', () => {
        const result = formatOrderNumber(0)
        expect(result).toBe('#ODR-000000')
    })

    // 大きな数値のテスト
    it('should handle large order numbers', () => {
        const result = formatOrderNumber(999999)
        expect(result).toBe('#ODR-999999')
    })

    // パディングより大きな数値のテスト
    it('should handle numbers larger than padding', () => {
        const result = formatOrderNumber(1234567, 'ODR', 4)
        expect(result).toBe('#ODR-1234567')
    })
})

/* ==================================== 
    formatOrderStatus Test
==================================== */
describe('formatOrderStatus', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should format known order statuses correctly', () => {
        const testCases = [
            { input: ORDER_PENDING, expected: '保留中' },
            { input: ORDER_PROCESSING, expected: CATEGORY_NOT_SHIPPED },
            { input: ORDER_SHIPPED, expected: CATEGORY_SHIPPED },
            { input: ORDER_DELIVERED, expected: '配送完了' },
            { input: ORDER_CANCELED, expected: 'キャンセル' },
            { input: ORDER_REFUNDED, expected: '返金済み' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(formatOrderStatus(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown order statuses', () => {
        const unknownStatus = 'UNKNOWN_STATUS' as OrderStatus;
        expect(formatOrderStatus(unknownStatus)).toBe(unknownStatus);
    })
})

/* ==================================== 
    formatPaymentMethodType Test
==================================== */
describe('formatPaymentMethodType', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should format known payment method types correctly', () => {
        const testCases = [
            { input: 'card', expected: 'クレジットカード' },
            { input: 'customer_balance', expected: '銀行振込' },
            { input: 'konbini', expected: 'コンビニ決済' },
            { input: 'bank_transfer', expected: '銀行口座引き落とし' },
            { input: 'paypay', expected: 'PayPay決済' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(formatPaymentMethodType(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown payment method types', () => {
        const unknownMethod = 'UNKNOWN_METHOD';
        expect(formatPaymentMethodType(unknownMethod)).toBe(unknownMethod);
    })
})

/* ==================================== 
    formatPaymentStatus Test
==================================== */
describe('formatPaymentStatus', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should format known payment statuses correctly', () => {
        const testCases = [
            { input: ORDER_PENDING, expected: '未払い' },
            { input: ORDER_CANCELED, expected: 'キャンセル' },
            { input: ORDER_REFUNDED, expected: '返金済み' },
            { input: ORDER_PROCESSING, expected: '支払い済み' },
            { input: ORDER_SHIPPED, expected: '支払い済み' },
            { input: ORDER_DELIVERED, expected: '支払い済み' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(formatPaymentStatus(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown payment statuses', () => {
        const unknownStatus = 'UNKNOWN_STATUS' as OrderStatus;
        expect(formatPaymentStatus(unknownStatus)).toBe('不明なステータス');
    })
})

/* ==================================== 
    formatPaymentCardBrand Test
==================================== */
describe('formatPaymentCardBrand', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should format known payment card brands correctly', () => {
        const testCases = [
            { input: 'card', expected: 'クレジットカード' },
            { input: 'visa', expected: 'クレジットカード（VISA）' },
            { input: 'mastercard', expected: 'クレジットカード（Mastercard）' },
            { input: 'amex', expected: 'クレジットカード（American Express）' },
            { input: 'jcb', expected: 'クレジットカード（JCB）' },
            { input: 'discover', expected: 'クレジットカード（Discover）' },
            { input: 'diners', expected: 'クレジットカード（Diners Club）' },
            { input: 'unionpay', expected: 'クレジットカード（UnionPay）' }
        ];
        
        testCases.forEach(({ input, expected }) => {
            expect(formatPaymentCardBrand(input)).toBe(expected);
        })
    })

    // 取得失敗
    it('should return original string for unknown payment card brands', () => {
        const unknownBrand = 'UNKNOWN_BRAND';
        expect(formatPaymentCardBrand(unknownBrand)).toBe(unknownBrand);
    })

    // cardBrand が null の場合
    it('should return "クレジットカード" when cardBrand is null', () => {
        const result = formatPaymentCardBrand(null);
        expect(result).toBe('クレジットカード');
    })
})


/* ==================================== 
    formatOrderDateTime Test
==================================== */
describe('formatOrderDateTime', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 基本的な成功ケース
    it('should format order date time with default type', () => {
        const mockTimestamp = 1640995200; // 2022-01-01 00:00:00 UTC
        const mockDate = new Date(mockTimestamp * TIMESTAMP_MULTIPLIER);
        const mockConvertedDate = new Date('2022-01-01T09:00:00+09:00');
        
        vi.mocked(convertToJST).mockReturnValue(mockConvertedDate);
        vi.mocked(formatDateCommon).mockReturnValue('2022.01.01');

        const result = formatOrderDateTime(mockTimestamp);

        expect(convertToJST).toHaveBeenCalledWith(mockDate);
        expect(formatDateCommon).toHaveBeenCalledWith(mockConvertedDate, DATE_DOT);
        expect(result).toBe('2022.01.01 09:00');
    })

    // カスタム日付フォーマットタイプのテスト
    it('should format with custom date format type', () => {
        const mockTimestamp = 1640995200;
        const mockConvertedDate = new Date('2022-01-01T09:00:00+09:00');
        
        vi.mocked(convertToJST).mockReturnValue(mockConvertedDate);
        vi.mocked(formatDateCommon).mockReturnValue('2022/01/01');

        const result = formatOrderDateTime(mockTimestamp, 'slash');

        expect(formatDateCommon).toHaveBeenCalledWith(mockConvertedDate, DATE_SLASH);
        expect(result).toBe('2022/01/01 09:00');
    })

    // 異なる時刻のテスト
    it('should format different times correctly', () => {
        const mockTimestamp = 1641004245; // 2022-01-01 00:00:00 UTC
        const mockConvertedDate = new Date('2022-01-01T15:30:45+09:00'); // 15:30:45 JST
        
        vi.mocked(convertToJST).mockReturnValue(mockConvertedDate);
        vi.mocked(formatDateCommon).mockReturnValue('2022.01.01');

        const result = formatOrderDateTime(mockTimestamp);

        expect(result).toBe('2022.01.01 15:30');
    })

    // パディングのテスト（1桁の時分）
    it('should pad single digit hours and minutes with zeros', () => {
        const mockTimestamp = 1640995200;
        const mockConvertedDate = new Date('2022-01-01T05:07:00+09:00'); // 05:07 JST
        
        vi.mocked(convertToJST).mockReturnValue(mockConvertedDate);
        vi.mocked(formatDateCommon).mockReturnValue('2022.01.01');

        const result = formatOrderDateTime(mockTimestamp);

        expect(result).toBe('2022.01.01 05:07');
    })

    // 境界値テスト（0時0分）
    it('should handle midnight correctly', () => {
        const mockTimestamp = 1640995200;
        const mockConvertedDate = new Date('2022-01-01T00:00:00+09:00');
        
        vi.mocked(convertToJST).mockReturnValue(mockConvertedDate);
        vi.mocked(formatDateCommon).mockReturnValue('2022.01.01');

        const result = formatOrderDateTime(mockTimestamp);

        expect(result).toBe('2022.01.01 00:00');
    })

    // 境界値テスト（23時59分）
    it('should handle end of day correctly', () => {
        const mockTimestamp = 1640995200;
        const mockConvertedDate = new Date('2022-01-01T23:59:00+09:00');
        
        vi.mocked(convertToJST).mockReturnValue(mockConvertedDate);
        vi.mocked(formatDateCommon).mockReturnValue('2022.01.01');

        const result = formatOrderDateTime(mockTimestamp);

        expect(result).toBe('2022.01.01 23:59');
    })

    // 異なる日付のテスト
    it('should format different dates correctly', () => {
        const mockTimestamp = 1672531200; // 2023-01-01 00:00:00 UTC
        const mockConvertedDate = new Date('2023-01-01T09:00:00+09:00');
        
        vi.mocked(convertToJST).mockReturnValue(mockConvertedDate);
        vi.mocked(formatDateCommon).mockReturnValue('2023.01.01');

        const result = formatOrderDateTime(mockTimestamp);

        expect(result).toBe('2023.01.01 09:00');
    })

    // エッジケース：負のタイムスタンプ
    it('should handle negative timestamp', () => {
        const mockTimestamp = -1640995200; // 過去の日付
        const mockConvertedDate = new Date('1921-12-31T15:00:00+09:00');
        
        vi.mocked(convertToJST).mockReturnValue(mockConvertedDate);
        vi.mocked(formatDateCommon).mockReturnValue('1921.12.31');

        const result = formatOrderDateTime(mockTimestamp);

        expect(result).toBe('1921.12.31 15:00');
    })

    // エッジケース：0のタイムスタンプ
    it('should handle zero timestamp', () => {
        const mockTimestamp = 0; // 1970-01-01 00:00:00 UTC
        const mockConvertedDate = new Date('1970-01-01T09:00:00+09:00');
        
        vi.mocked(convertToJST).mockReturnValue(mockConvertedDate);
        vi.mocked(formatDateCommon).mockReturnValue('1970.01.01');

        const result = formatOrderDateTime(mockTimestamp);

        expect(result).toBe('1970.01.01 09:00');
    })

    // 大きなタイムスタンプのテスト
    it('should handle large timestamp', () => {
        const mockTimestamp = 4102444800; // 2100-01-01 00:00:00 UTC
        const mockConvertedDate = new Date('2100-01-01T09:00:00+09:00');
        
        vi.mocked(convertToJST).mockReturnValue(mockConvertedDate);
        vi.mocked(formatDateCommon).mockReturnValue('2100.01.01');

        const result = formatOrderDateTime(mockTimestamp);

        expect(result).toBe('2100.01.01 09:00');
    })
})

/* ==================================== 
    formatPaymentDueDate Test
==================================== */
describe('formatPaymentDueDate', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 基本的な成功ケース
    it('should format payment due date correctly', () => {
        const mockTimestamp = 1640995200; // 2022-01-01 00:00:00 UTC
        const expectedDueDate = new Date(mockTimestamp * TIMESTAMP_MULTIPLIER + PAYMENT_DUE_DATE);
        
        vi.mocked(formatDateCommon).mockReturnValue('2022/01/08');

        const result = formatPaymentDueDate(mockTimestamp);

        expect(formatDateCommon).toHaveBeenCalledWith(expectedDueDate, DATE_SLASH);
        expect(result).toBe('2022/01/08');
    })

    // 異なるタイムスタンプのテスト
    it('should format different timestamps correctly', () => {
        const mockTimestamp = 1672531200; // 2023-01-01 00:00:00 UTC
        const expectedDueDate = new Date(mockTimestamp * TIMESTAMP_MULTIPLIER + PAYMENT_DUE_DATE);
        
        vi.mocked(formatDateCommon).mockReturnValue('2023/01/08');

        const result = formatPaymentDueDate(mockTimestamp);

        expect(formatDateCommon).toHaveBeenCalledWith(expectedDueDate, DATE_SLASH);
        expect(result).toBe('2023/01/08');
    })

    // 月末をまたぐケースのテスト
    it('should handle month boundary correctly', () => {
        const mockTimestamp = 1640995200; // 2022-01-25 00:00:00 UTC (例)
        const expectedDueDate = new Date(mockTimestamp * TIMESTAMP_MULTIPLIER + PAYMENT_DUE_DATE);
        
        vi.mocked(formatDateCommon).mockReturnValue('2022/02/01');

        const result = formatPaymentDueDate(mockTimestamp);

        expect(formatDateCommon).toHaveBeenCalledWith(expectedDueDate, DATE_SLASH);
        expect(result).toBe('2022/02/01');
    })

    // 年をまたぐケースのテスト
    it('should handle year boundary correctly', () => {
        const mockTimestamp = 1672531200; // 2022-12-25 00:00:00 UTC (例)
        const expectedDueDate = new Date(mockTimestamp * TIMESTAMP_MULTIPLIER + PAYMENT_DUE_DATE);
        
        vi.mocked(formatDateCommon).mockReturnValue('2023/01/01');

        const result = formatPaymentDueDate(mockTimestamp);

        expect(formatDateCommon).toHaveBeenCalledWith(expectedDueDate, DATE_SLASH);
        expect(result).toBe('2023/01/01');
    })

    // うるう年のテスト
    it('should handle leap year correctly', () => {
        const mockTimestamp = 1704067200; // 2024-02-25 00:00:00 UTC
        const expectedDueDate = new Date(mockTimestamp * TIMESTAMP_MULTIPLIER + PAYMENT_DUE_DATE);
        
        vi.mocked(formatDateCommon).mockReturnValue('2024/03/03');

        const result = formatPaymentDueDate(mockTimestamp);

        expect(formatDateCommon).toHaveBeenCalledWith(expectedDueDate, DATE_SLASH);
        expect(result).toBe('2024/03/03');
    })

    // エッジケース：負のタイムスタンプ
    it('should handle negative timestamp', () => {
        const mockTimestamp = -1640995200; // 過去の日付
        const expectedDueDate = new Date(mockTimestamp * TIMESTAMP_MULTIPLIER + PAYMENT_DUE_DATE);
        
        vi.mocked(formatDateCommon).mockReturnValue('1921/12/31');

        const result = formatPaymentDueDate(mockTimestamp);

        expect(formatDateCommon).toHaveBeenCalledWith(expectedDueDate, DATE_SLASH);
        expect(result).toBe('1921/12/31');
    })

    // エッジケース：0のタイムスタンプ
    it('should handle zero timestamp', () => {
        const mockTimestamp = 0; // 1970-01-01 00:00:00 UTC
        const expectedDueDate = new Date(mockTimestamp * TIMESTAMP_MULTIPLIER + PAYMENT_DUE_DATE);
        
        vi.mocked(formatDateCommon).mockReturnValue('1970/01/08');

        const result = formatPaymentDueDate(mockTimestamp);

        expect(formatDateCommon).toHaveBeenCalledWith(expectedDueDate, DATE_SLASH);
        expect(result).toBe('1970/01/08');
    })

    // 7日間の加算が正しく動作することを確認
    it('should add exactly 7 days to the timestamp', () => {
        const mockTimestamp = 1640995200; // 2022-01-01 00:00:00 UTC
        const expectedDueDate = new Date(mockTimestamp * TIMESTAMP_MULTIPLIER + PAYMENT_DUE_DATE);
        
        const expectedTimestamp = mockTimestamp * TIMESTAMP_MULTIPLIER + PAYMENT_DUE_DATE;
        const actualTimestamp = expectedDueDate.getTime();
        
        expect(actualTimestamp).toBe(expectedTimestamp);
    })
})

/* ==================================== 
    getPaymentErrorDetails Test
==================================== */
describe('getPaymentErrorDetails', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // 取得成功
    it('should get known payment error details correctly', () => {
        const testCases = [
            { input: 'card_declined', expected: '使用拒否' },
            { input: 'expired_card', expected: '有効期限切れ' },
            { input: 'incorrect_cvc', expected: 'セキュリティーコードエラー' },
            { input: 'processing_error', expected: '処理中にエラー発生' },
            { input: 'rate_limit', expected: 'リクエスト過多' },
            { input: 'authentication_required', expected: '認証不足' },
            { input: 'insufficient_funds', expected: '残高不足' },
            { input: 'card_not_supported', expected: '不正なカードです' },
            { input: 'currency_not_supported', expected: '不正な通貨です' },
            { input: 'fraudulent', expected: '不正利用の可能性あり' },
            { input: 'lost_card', expected: '紛失したカードです' },
            { input: 'stolen_card', expected: '盗難したカードです' },
            { input: 'generic_decline', expected: '使用拒否' },
            { input: 'do_not_honor', expected: '使用拒否' },
            { input: 'call_issuer', expected: 'カード発行会社にお問い合わせ' },
            { input: 'pickup_card', expected: '回収されたカードです' },
            { input: 'invalid_amount', expected: '無効な金額' },
            { input: 'duplicate_transaction', expected: '重複した取引' },
            { input: 'card_velocity_exceeded', expected: 'カードの利用回数制限超過' },
            { input: 'unknown', expected: '不明なエラー' }
        ];

        testCases.forEach(({ input, expected }) => {
            const result = getPaymentErrorDetails(input);
            expect(result).toBe(expected);
        });
    })

    // 取得失敗（未知のエラータイプ）
    it('should return UNKNOWN error message for unknown error types', () => {
        const unknownErrorTypes = [
            'unknown_error',
            'invalid_error',
            'test_error',
            '',
            '123',
            'CARD_DECLINED', // 大文字小文字が違う
            'Card_Declined'  // 大文字小文字が違う
        ];

        unknownErrorTypes.forEach(errorType => {
            const result = getPaymentErrorDetails(errorType);
            expect(result).toBe('不明なエラー');
        });
    })

    // 取得失敗（空文字列）
    it('should handle empty string', () => {
        const result = getPaymentErrorDetails('');
        expect(result).toBe('不明なエラー');
    })
})