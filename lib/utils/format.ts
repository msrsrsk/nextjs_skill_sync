import { 
    CATEGORY_TAGS, 
    PRODUCT_PRICE_STATUS,
    OPTIMAL_SYNC_TAG_TYPES,
    ORDER_STATUS, 
    ORDER_HISTORY_CATEGORIES,
    COLLECTION_SORT_TYPES,
    PAYMENT_DUE_DATE,
    FILE_UPLOAD_CONFIG,
    FILE_STATUS_TYPES,
    SYNC_SOLD_OUT_CONFIG,
    DATE_FORMAT_TYPES,
    DATE_FORMAT_CONFIG,
    FILE_MIME_TYPES,
    ORDER_NUMBER_PADDING,
    SUBSCRIPTION_INTERVALS,
    SUBSCRIPTION_INTERVAL_THRESHOLDS
} from "@/constants/index"

const { 
    ACTIVE_TAG, 
    EXPLORER_TAG, 
    CREATIVE_TAG, 
    WISDOM_TAG, 
    UNIQUE_TAG,
    RANDOM_TAG
} = CATEGORY_TAGS;
const { UPLOAD_BYTES_BASE, MAX_TOTAL_SIZE_TEXT } = FILE_UPLOAD_CONFIG;
const { FILE_LOADING, FILE_ERROR } = FILE_STATUS_TYPES;
const { MILLION_THRESHOLD, THOUSAND_THRESHOLD, KILO_DIVISOR } = SYNC_SOLD_OUT_CONFIG;
const { PRODUCT_SALE, PRODUCT_SOLDOUT } = PRODUCT_PRICE_STATUS;
const { REQUIRED_TAG, OPTION_TAG, PICKUP_TAG } = OPTIMAL_SYNC_TAG_TYPES;
const { 
    ORDER_PENDING, 
    ORDER_PROCESSING, 
    ORDER_SHIPPED, 
    ORDER_DELIVERED, 
    ORDER_CANCELLED, 
    ORDER_REFUNDED 
} = ORDER_STATUS;
const { 
    CATEGORY_NOT_SHIPPED, 
    CATEGORY_SHIPPED 
} = ORDER_HISTORY_CATEGORIES;
const { DATE_DOT, DATE_SLASH, DATE_FULL, DATE_OMISSION } = DATE_FORMAT_TYPES;
const { 
    CREATED_DESCENDING, 
    BEST_SELLING, 
    TITLE_ASCENDING, 
    TITLE_DESCENDING, 
    PRICE_ASCENDING, 
    PRICE_DESCENDING 
} = COLLECTION_SORT_TYPES;
const { 
    MONTH_OFFSET,
    PADDING_LENGTH, 
    TIMESTAMP_MULTIPLIER,
    MILLISECONDS_PER_DAY,
    DAYS_PER_WEEK,
    DAYS_PER_MONTH,
    DAYS_PER_YEAR
} = DATE_FORMAT_CONFIG;
const { IMAGE_JPEG, IMAGE_JPG, IMAGE_PNG } = FILE_MIME_TYPES;
const { 
    INTERVAL_DAY, 
    INTERVAL_WEEK, 
    INTERVAL_MONTH, 
    INTERVAL_3MONTH, 
    INTERVAL_6MONTH, 
    INTERVAL_YEAR 
} = SUBSCRIPTION_INTERVALS;
const { THRESHOLD_3MONTH, THRESHOLD_6MONTH } = SUBSCRIPTION_INTERVAL_THRESHOLDS;


/* ============================== 
    ファイル関連フォーマット
============================== */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0B';
    
    const k = UPLOAD_BYTES_BASE;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const getFileExtension = (mimeType: FileMimeType): string => {
    const extensionMap = {
        [IMAGE_JPEG]: 'jpg',
        [IMAGE_JPG]: 'jpg',
        [IMAGE_PNG]: 'png'
    };
    return extensionMap[mimeType] || 'jpg';
};

export const dataUrlToFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || IMAGE_JPEG;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
};


/* ============================== 
    数値関連フォーマット
============================== */
export const formatNumber = (num: number): string => {
    return num.toLocaleString();
};

export const formatSoldOutNumber = (num: number): string => {
    if (num >= MILLION_THRESHOLD) {
        return (num / MILLION_THRESHOLD).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= THOUSAND_THRESHOLD) {
        return Math.floor(num / KILO_DIVISOR) + 'K';
    } else {
        return num.toLocaleString();
    }
};

export const formatOrderNumber = (
    orderNumber: number, 
    prefix: string = 'ODR', 
    padding: number = ORDER_NUMBER_PADDING
): string => {
    const paddedNumber = orderNumber.toString().padStart(padding, '0');
    return `#${prefix}-${paddedNumber}`;
};


/* ============================== 
    HTML関連フォーマット
============================== */
export const formatHtmlToPlainText = (content: string): string => {
    if (!content) return '';
    
    // HTMLタグを削除
    const plainText = content
        .replace(/<[^>]*>/g, '')  // HTMLタグを削除
        .replace(/&nbsp;/g, ' ')  // &nbsp;をスペースに変換
        .replace(/\s+/g, ' ')     // 複数の空白を1つに
        .trim();                  // 前後の空白を削除

    return plainText;
};

export const parseNewlineToArray = (text: string): string[] => {
    return text.split('\n').filter(item => item.trim()) || [];
};


/* ============================== 
    テキスト関連フォーマット
============================== */
export const formatTitleCase = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatCategory = (category: Exclude<ProductCategoryTagType, 'ALL_TAG'>): string => {
    if (!category) return '';
    
    const categoryMap = {
        [ACTIVE_TAG]: "アクティブ",
        [EXPLORER_TAG]: "冒険",
        [CREATIVE_TAG]: "創作",
        [WISDOM_TAG]: "知恵",
        [UNIQUE_TAG]: "ユニーク",
        [RANDOM_TAG]: "ランダム",
    }
    return categoryMap[category] || category;
};

export const formatCollectionSortType = (sortType: CollectionSortType): string => {
    if (!sortType) return '';
    
    const sortTypeMap = {
        [CREATED_DESCENDING]: "新着順",
        [BEST_SELLING]: "ベストセラー",
        [TITLE_ASCENDING]: "タイトル順（A,Z）",
        [TITLE_DESCENDING]: "タイトル順（Z,A）",
        [PRICE_ASCENDING]: "価格の安い順",
        [PRICE_DESCENDING]: "価格の高い順",
    }
    return sortTypeMap[sortType] || sortType;
};

export const formatProductPriceStatus = (status: ProductPriceStatusType): string => {
    const statusMap = {
        [PRODUCT_SALE]: "セール中",
        [PRODUCT_SOLDOUT]: "売り切れ",
    }
    return statusMap[status] || status;
};

export const formatOptimalSyncsStatus = (status: OptimalSyncTagType): string => {
    const statusMap = {
        [PICKUP_TAG]: "おすすめ",
        [REQUIRED_TAG]: "必須",
        [OPTION_TAG]: "オプション",
    }
    return statusMap[status] || status;
};

export const formatFileStatusMessage = (type: FileStatusType): string => {
    const messageMap = {
        [FILE_LOADING]: '※ファイルをアップロード中...',
        [FILE_ERROR]: `※容量が合計${MAX_TOTAL_SIZE_TEXT}を超えています`,
    }
    return messageMap[type] || '';
};

export const formatOrderStatus = (status: OrderStatus): string => {
    const statusMap = {
        [ORDER_PENDING]: '保留中',
        [ORDER_PROCESSING]: CATEGORY_NOT_SHIPPED,
        [ORDER_SHIPPED]: CATEGORY_SHIPPED,
        [ORDER_DELIVERED]: '配送完了',
        [ORDER_CANCELLED]: 'キャンセル',
        [ORDER_REFUNDED]: '返金済み',
    }
    return statusMap[status] || status;
};

export const formatPaymentMethodType = (paymentMethodType: string): string => {
    const methodMap = {
        'card': 'クレジットカード',
        'customer_balance': '銀行振込',
        'konbini': 'コンビニ決済',
        'bank_transfer': '銀行口座引き落とし',
        'paypay': 'PayPay決済',
    }
    return methodMap[paymentMethodType as keyof typeof methodMap] || paymentMethodType;
};

export const formatPaymentStatus = (status: OrderStatus): string => {
    const statusMap = {
        [ORDER_PENDING]: '未払い',
        [ORDER_CANCELLED]: 'キャンセル',
        [ORDER_REFUNDED]: '返金済み',
        [ORDER_PROCESSING]: '支払い済み',
        [ORDER_SHIPPED]: '支払い済み',
        [ORDER_DELIVERED]: '支払い済み',
    }
    return statusMap[status] || '不明なステータス';
};

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
};

export const formatSubscriptionInterval = (interval: string): string => {
    const intervalMap: Record<string, string> = {
        [INTERVAL_DAY]: '毎日',
        [INTERVAL_WEEK]: '毎週',
        [INTERVAL_MONTH]: '1ヶ月毎',
        [INTERVAL_3MONTH]: '3ヶ月毎',
        [INTERVAL_6MONTH]: '6ヶ月毎',
        [INTERVAL_YEAR]: '1年毎',
    };
    
    return intervalMap[interval] || interval;
};

export const formatSubscriptionIntervalForOrder = (interval: string): string => {
    const intervalMap: Record<string, string> = {
        '1day': '継続購入：毎日',
        '1week': '継続購入：毎週',
        '1month': '継続購入：1ヶ月毎',
        '3month': '継続購入：3ヶ月毎',
        '6month': '継続購入：6ヶ月毎',
    };
    
    return intervalMap[interval] || interval;
};

export const formatOrderRemarks = (item: {
    subscription_interval: string | null;
    subscription_product: boolean | null;
}): string | null => {
    if (!item.subscription_interval && item.subscription_product) {
        return '通常購入：1回のみの購入';
    }
    
    if (item.subscription_interval && item.subscription_product) {
        return formatSubscriptionIntervalForOrder(item.subscription_interval);
    }
    
    return null;
};

export const formatStripeSubscriptionStatus = (stripeStatus: string): SubscriptionPaymentStatus => {
    const statusMap: Record<string, SubscriptionPaymentStatus> = {
        'past_due': 'failed',
        'active': 'succeeded',
        'unpaid': 'failed',
        'canceled': 'canceled',
    };
    
    return statusMap[stripeStatus] || 'pending';
};

export const formatCreateSubscriptionNickname = (interval: string): string => {
    const intervalMap: Record<string, string> = {
        'day': '1日毎価格',
        'week': '1週間毎価格',
        'month': '1ヶ月毎価格',
        '3month': '3ヶ月毎価格',
        '6month': '6ヶ月毎価格',
        'year': '1年毎価格',
    };

    return intervalMap[interval] || interval;
};


/* ============================== 
    日付関連フォーマット
============================== */
export const convertToJST = (date: Date): Date => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return new Date(date.toLocaleString('en-US', {
        timeZone: userTimezone
    }));
};

const formatDateCommon = (
    date: Date, 
    type: DateFormatType = DATE_DOT
): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + MONTH_OFFSET).padStart(PADDING_LENGTH, '0');
    const day = String(date.getDate()).padStart(PADDING_LENGTH, '0');
    
    switch (type) {
        case DATE_DOT:
            return `${year}.${month}.${day}`;
        case DATE_SLASH:
            return `${year}/${month}/${day}`;
        case DATE_FULL:
            return `${year}年${month}月${day}日`;
        case DATE_OMISSION:
        default:
            return `${year}${month}${day}`;
    }
};

export const formatDate = (
    dateString: Date,
    type: DateFormatType = DATE_DOT
): string => {
    const date = new Date(dateString);
    const convertedDate = convertToJST(date);
    return formatDateCommon(convertedDate, type);
};

export const formatDateTime = (dateString: Date): string => {
    const date = new Date(dateString);
    const convertedDate = convertToJST(date);
    const datePart = formatDateCommon(convertedDate);

    const hours = String(date.getHours()).padStart(PADDING_LENGTH, '0');
    const minutes = String(date.getMinutes()).padStart(PADDING_LENGTH, '0');
    
    return `${datePart} ${hours}:${minutes}`;
};

export const formatRelativeDate = (dateString: Date): string => {
    const now = new Date();
    const targetDate = new Date(dateString);

    const convertedDate = convertToJST(targetDate);
    
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDateOnly = new Date(
        convertedDate.getFullYear(), 
        convertedDate.getMonth(), convertedDate.getDate()
    );
    
    const diffTime = nowDate.getTime() - targetDateOnly.getTime();
    const diffDays = Math.floor(diffTime / MILLISECONDS_PER_DAY);
    const diffWeeks = Math.floor(diffDays / DAYS_PER_WEEK);
    const diffMonths = Math.floor(diffDays / DAYS_PER_MONTH);

    // 1週間以内
    if (diffDays < DAYS_PER_WEEK) {
        if (diffDays === 0) return 'today';
        if (diffDays === 1) return 'yesterday';
        return `${diffDays} days ago`;
    }
    
    // 1ヶ月以内
    if (diffDays < DAYS_PER_MONTH) {
        if (diffWeeks === 1) return '1 week ago';
        return `${diffWeeks} weeks ago`;
    }
    
    // 1年以内
    if (diffDays < DAYS_PER_YEAR) {
        if (diffMonths === 1) return '1 month ago';
        return `${diffMonths} months ago`;
    }
    
    // 1年を超えた場合
    return formatDateCommon(targetDate);
};

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
};

export const formatPaymentDueDate = (timestamp: number): string => {
    const dueDate = new Date(timestamp * TIMESTAMP_MULTIPLIER + PAYMENT_DUE_DATE);
    return formatDateCommon(dueDate, DATE_SLASH);
};


/* ============================== 
    Stripe関連フォーマット
============================== */
export const getRecurringConfig = (interval: string) => {
    switch (interval) {
        case INTERVAL_DAY:
            return { interval: 'day' };
        case INTERVAL_WEEK:
            return { interval: 'week' };
        case INTERVAL_MONTH:
            return { interval: 'month' };
        case INTERVAL_3MONTH:
            return { interval: 'month', interval_count: THRESHOLD_3MONTH };
        case INTERVAL_6MONTH:
            return { interval: 'month', interval_count: THRESHOLD_6MONTH };
        case INTERVAL_YEAR:
            return { interval: 'year' };
        default:
            return null;
    }
};