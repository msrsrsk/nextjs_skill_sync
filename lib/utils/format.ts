import { 
    FILE_UPLOAD_CONFIG,
    SYNC_SOLD_OUT_CONFIG,
    DATE_FORMAT_TYPES,
    DATE_FORMAT_CONFIG,
    FILE_MIME_TYPES
} from "@/constants/index"

const { UPLOAD_BYTES_BASE } = FILE_UPLOAD_CONFIG;
const { MILLION_THRESHOLD, THOUSAND_THRESHOLD, KILO_DIVISOR } = SYNC_SOLD_OUT_CONFIG;
const { DATE_DOT, DATE_SLASH, DATE_FULL, DATE_OMISSION } = DATE_FORMAT_TYPES;
const { 
    MONTH_OFFSET,
    PADDING_LENGTH, 
    MILLISECONDS_PER_DAY,
    DAYS_PER_WEEK,
    DAYS_PER_MONTH,
    DAYS_PER_YEAR
} = DATE_FORMAT_CONFIG;
const { IMAGE_JPEG, IMAGE_JPG, IMAGE_PNG } = FILE_MIME_TYPES;


/* ============================== 
    ファイル関連フォーマット
============================== */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0B';
    
    const k = UPLOAD_BYTES_BASE;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const getFileExtension = (mimeType: FileMimeType): string => {
    const extensionMap = {
        [IMAGE_JPEG]: 'jpg',
        [IMAGE_JPG]: 'jpg',
        [IMAGE_PNG]: 'png'
    }
    
    return extensionMap[mimeType] || 'jpg';
}

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
}


/* ============================== 
    数値関連フォーマット
============================== */
export const formatNumber = (num: number): string => {
    return num.toLocaleString();
}

export const formatSoldOutNumber = (num: number): string => {
    if (num >= MILLION_THRESHOLD) {
        return (num / MILLION_THRESHOLD).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= THOUSAND_THRESHOLD) {
        return Math.floor(num / KILO_DIVISOR) + 'K';
    } else {
        return num.toLocaleString();
    }
}


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
}

export const parseNewlineToArray = (text: string): string[] => {
    return text.split('\n').map(item => item.trim()).filter(item => item) || [];
}


/* ============================== 
    テキスト関連フォーマット
============================== */
export const formatTitleCase = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}


/* ============================== 
    日付関連フォーマット
============================== */
export const convertToJST = (date: Date): Date => {
    return new Date(date.toLocaleString('en-US', {
        timeZone: 'Asia/Tokyo'
    }))
}

export const formatDateCommon = (
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
}

export const formatDate = (
    dateString: Date,
    type: DateFormatType = DATE_DOT
): string => {
    const date = new Date(dateString);
    const convertedDate = convertToJST(date);
    return formatDateCommon(convertedDate, type);
}

export const formatDateTime = (dateString: Date): string => {
    const date = new Date(dateString);
    const convertedDate = convertToJST(date);
    const datePart = formatDateCommon(convertedDate);

    const hours = String(date.getHours()).padStart(PADDING_LENGTH, '0');
    const minutes = String(date.getMinutes()).padStart(PADDING_LENGTH, '0');
    
    return `${datePart} ${hours}:${minutes}`;
}

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

    if (diffDays < 0) return 'Invalid date';

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
}