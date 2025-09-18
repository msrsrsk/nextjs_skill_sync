/* ============================== 
    共通定数
============================== */

const BASE_SIZE = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

const BASE_POSITION = {
    CENTER: 'center',
    LEFT: 'left',
    RIGHT: 'right',
}

const BASE_STATUS = {
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
}

const BASE_TEXT = {
    EN: 'en',
    JA: 'ja',
}


/* ============================== 
    サイト情報
============================== */

// URLの指定
export const ACCOUNT_MATCHER = '/account/:path*';

// 営業時間
export const BUSINESS_HOURS_CONFIG = {
    HOURS_TIME: '10:00 - 19:00',
    HOURS_NOTE: '（祝日を除く平日のみ）',
}

// 配送料
export const SHIPPING_FEE_250 = 250;

// ストレージキー
export const STORAGE_KEYS = {
    SKILL_TRAIL_KEY: 'skill-sync:skill-trail'
}

// サイトマップ
export const SITE_MAP = {
    HOME_PATH: '/',
    
    // CATEGORY
    CATEGORY_PATH: '/category',
    CATEGORY_ALL_PATH: '/category/all',
    CATEGORY_ACTIVE_PATH: '/category/active',
    CATEGORY_EXPLORER_PATH: '/category/explorer',
    CATEGORY_CREATIVE_PATH: '/category/creative',
    CATEGORY_WISDOM_PATH: '/category/wisdom',
    CATEGORY_UNIQUE_PATH: '/category/unique',

    // TREND
    TREND_PATH: '/trend',
    TREND_ALL_PATH: '/trend/all',
    TREND_ACTIVE_PATH: '/trend/active',
    TREND_EXPLORER_PATH: '/trend/explorer',
    TREND_CREATIVE_PATH: '/trend/creative',
    TREND_WISDOM_PATH: '/trend/wisdom',
    TREND_UNIQUE_PATH: '/trend/unique',

    // SYNC LOG
    SYNC_LOG_PATH: '/sync-log',
    SYNC_LOG_ALL_PATH: '/sync-log/all',
    SYNC_LOG_UPDATES_PATH: '/sync-log/updates',
    SYNC_LOG_VOICES_PATH: '/sync-log/voices',
    SYNC_LOG_EXTRAS_PATH: '/sync-log/extras',

    // PAGES
    REVIEW_PATH: '/review',
    SEARCH_PATH: '/search',
    FAQ_PATH: '/faq',
    
    LOGIN_PATH: '/login',
    LOGOUT_PATH: '/logout',
    CREATE_ACCOUNT_PATH: '/create-account',
    CREATE_ACCOUNT_VERIFY_PATH: '/create-account/verify',
    RESET_PASSWORD_PATH: '/reset-password',
    RESET_PASSWORD_NEW_PASSWORD_PATH: '/reset-password/new-password',
    RESET_PASSWORD_VERIFY_PATH: '/reset-password/verify',
    CART_PATH: '/cart',
    ORDER_COMPLETE_PATH: '/cart/order-complete',
    NOT_FOUND_PATH: '/not-found',
    DELETE_ACCOUNT_PUBLIC_PATH: '/delete-account',
    
    // ACCOUNT
    ACCOUNT_PATH: '/account',
    ACCOUNT_INFO_PATH: '/account/account-info',
    EDIT_EMAIL_PATH: '/account/edit-email',
    EDIT_EMAIL_VERIFY_PATH: '/account/edit-email/verify',
    EDIT_PASSWORD_PATH: '/account/edit-password',
    EDIT_PASSWORD_VERIFY_PATH: '/account/edit-password/verify',
    SHIPPING_INFO_PATH: '/account/shipping-info',
    SUBSCRIPTION_HISTORY_PATH: '/account/subscription-history',
    ORDER_HISTORY_PATH: '/account/order-history',
    ACCOUNT_REVIEW_PATH: '/account/review-history',
    BOOK_MARK_PATH: '/account/book-mark',
    SUPPORT_CHAT_PATH: '/account/support-chat',
    DELETE_ACCOUNT_PRIVATE_PATH: '/account/delete-account',

    // PAGES
    CONTACT_PATH: '/contact',
    PRIVACY_PATH: '/privacy',
    TERMS_PATH: '/terms',
    TOKUSHOHO_PATH: '/tokushoho',
    PRINT_PATH: '/print',
    NOT_AVAILABLE_PATH: '/not-available',

    // OTHER
    ICON_PATH: '/assets/icons',
    PRODUCT_PATH: '/assets/products',
    IMAGE_PATH: '/assets/images',

    ANOTHER_WORLD_PATH: '/#another-world',

    // API
    USER_API_PATH: '/api/user',
    BOOKMARK_ITEMS_API_PATH: '/api/bookmark-items',
    BOOKMARK_DATA_API_PATH: '/api/bookmark-data',
    BOOKMARK_PRODUCT_API_PATH: '/api/bookmark-product',
    CART_DATA_API_PATH: '/api/cart-data',
    CART_ITEMS_API_PATH: '/api/cart-items',
    CART_QUANTITY_API_PATH: '/api/cart-quantity',
    PRODUCTS_API_PATH: '/api/products',
    CHECKOUT_API_PATH: '/api/checkout',
    SUBSCRIPTION_CHECK_API_PATH: '/api/subscription-check',
    SUBSCRIPTION_CHECKOUT_API_PATH: '/api/subscription-checkout',
    SUBSCRIPTION_CANCEL_API_PATH: '/api/subscription-cancel',
    CHAT_API_PATH: '/api/chat',
    SHIPPING_ADDRESS_API_PATH: '/api/shipping-address',
}

// 領収書の設定
export const RECEIPT_CONFIG = {
    TAX_RATE_8: 0.08,
    TAX_RATE_10: 0.1,
}

// Cloudflareのバケットタイプ
export const CLOUDFLARE_BUCKET_TYPES = {
    BUCKET_REVIEW: 'review',
    BUCKET_PROFILE: 'profile',
}

// メタデータのタイプ
export const METADATA_TYPES = {
    WEBSITE: 'website',
    ARTICLE: 'article',
}


/* ============================== 
    共通項目
============================== */

// メディアクエリ
export const MEDIA_QUERY_CONFIG = {
    SIZE_MEDIUM: 768,
    SIZE_LARGE_MEDIUM: 960,
    SIZE_LARGE: 1024,
}

// アップロードファイルの最大サイズ
export const FILE_UPLOAD_CONFIG = {
    INITIAL_TOTAL_SIZE: 0,
    MAX_TOTAL_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_ACCOUNT_INFO_ICON_SIZE: 100 * 1024, // 100KB
    MAX_TOTAL_SIZE_TEXT: '5MB',
    MAX_ACCOUNT_INFO_ICON_SIZE_TEXT: '100KB',
    UPLOAD_BYTES_BASE: 1024,
}

// アップロードファイルのランダムIDの設定
export const FILE_UPLOAD_RANDOM_ID = {
    RANDOM_RADIX: 36,
    RANDOM_START_INDEX: 2,
    RANDOM_LENGTH: 8,
}

// カートアイコンの太さ
export const CART_ICON_STROKE_WIDTH = 2.5;

// ページ上部へのスクロールの設定
export const SCROLL_TOP_CONFIG = {
    THRESHOLD_TOP: 0,
    SCROLL_TOP_THRESHOLD: 200,
    DELAY_TIME: 500,
}

// デフォルトのページ
export const DEFAULT_PAGE = '1';

// マウスの位置の初期値
export const MOUSE_POSITION_CONFIG = {
    INITIAL: { x: 0, y: 0 }
}

// zustandストアの各種初期値
export const STORE_CONFIG = {
    INITIAL_CART_COUNT: 0,
    INITIAL_AGREEMENTS: {}
}

// モバイルのブレイクポイントのオフセット
export const MOBILE_BREAKPOINT_OFFSET = 1;

// ページネーションの設定
export const PAGINATION_CONFIG = {
    INITIAL_PAGE: 1,
    PAGE_OFFSET: 1
}

// 日付のフォーマットのタイプ
export const DATE_FORMAT_TYPES = {
    DATE_DOT: 'dot',
    DATE_SLASH: 'slash',
    DATE_FULL: 'full',
    DATE_OMISSION: 'omission',
}

// 日付のフォーマットの設定
export const DATE_FORMAT_CONFIG = {
    MONTH_OFFSET: 1,
    PADDING_LENGTH: 2,
    TIMESTAMP_MULTIPLIER: 1000,
    MILLISECONDS_PER_DAY: 1000 * 60 * 60 * 24,
    DAYS_PER_WEEK: 7,
    DAYS_PER_MONTH: 30,
    DAYS_PER_YEAR: 365,
}

// ファイルのMIMEタイプ
export const FILE_MIME_TYPES = {
    IMAGE_JPEG: 'image/jpeg',
    IMAGE_JPG: 'image/jpg',
    IMAGE_PNG: 'image/png',
}

// デフォルトの画像URL
export const DEFAULT_ACCOUNT_ICON_URL = `${SITE_MAP.ICON_PATH}/avatar04.png`;
export const ANONYMOUS_USER_ICON_URL = `${SITE_MAP.ICON_PATH}/anonymous.png`;
export const NOIMAGE_PRODUCT_IMAGE_URL = `${SITE_MAP.PRODUCT_PATH}/no-image.png`;
export const LOGO_IMAGE_PATH = `${SITE_MAP.IMAGE_PATH}/logo.png`

// アップロードファイルのステータス
export const FILE_STATUS_TYPES = {
    FILE_LOADING: BASE_STATUS.LOADING,
    FILE_SUCCESS: BASE_STATUS.SUCCESS,
    FILE_ERROR: BASE_STATUS.ERROR,
};

// 共通ボタンのサイズ
export const BUTTON_SIZES = {
    BUTTON_SMALL: BASE_SIZE.SMALL,
    BUTTON_MEDIUM: BASE_SIZE.MEDIUM,
    BUTTON_LARGE: BASE_SIZE.LARGE,
};

// 共通ボタンのテキスト
export const BUTTON_TEXT_TYPES = {
    BUTTON_EN: BASE_TEXT.EN,
    BUTTON_JA: BASE_TEXT.JA,
};

// 共通ボタンのポジション
export const BUTTON_POSITIONS = {
    POSITION_CENTER: BASE_POSITION.CENTER,
    POSITION_LEFT: BASE_POSITION.LEFT,
    POSITION_RIGHT: BASE_POSITION.RIGHT,
};

// 共通ボタンのタイプ
export const BUTTON_TYPES = {
    BUTTON_TYPE: 'button',
    SUBMIT_TYPE: 'submit',
};

// 共通ボタンのバリエーション
export const BUTTON_VARIANTS = {
    BUTTON_PRIMARY: 'primary',
    BUTTON_SECONDARY: 'secondary',
};

// アンダーラインリンクのポジション
export const UNDERLINE_LINK_POSITIONS = {
    POSITION_CENTER: BUTTON_POSITIONS.POSITION_CENTER,
    POSITION_LEFT: BUTTON_POSITIONS.POSITION_LEFT,
    POSITION_RIGHT: BUTTON_POSITIONS.POSITION_RIGHT,
};

// モーダルのサイズ
export const MODAL_SIZES = {
    MODAL_SMALL: BASE_SIZE.SMALL,
    MODAL_MEDIUM: BASE_SIZE.MEDIUM,
};

// エラーメッセージのポジション
export const ERROR_MESSAGE_POSITIONS = {
    ERROR_LEFT: BASE_POSITION.LEFT,
    ERROR_CENTER: BASE_POSITION.CENTER,
};

// オーバーレイのタイプ
export const OVERLAY_TYPES = {
    WITH_HEADER: 'withHeader',
    WITHOUT_HEADER: 'withoutHeader',
};

// タブのテキストの種類
export const TAB_TEXT_TYPES = {
    TAB_EN: BASE_TEXT.EN,
    TAB_JA: BASE_TEXT.JA,
};

// ドロップゾーンのタイプ
export const DROPZONE_TYPES = {
    DROPZONE_REVIEW: 'review',
    DROPZONE_CONTACT: 'contact',
};

// ローディングスピナーのサイズ
export const LOADING_SPINNER_SIZES = {
    LOADING_SMALL: BASE_SIZE.SMALL,
    LOADING_MEDIUM: BASE_SIZE.MEDIUM,
};

// JWTの有効期限
export const JWT_CONFIG = {
    EXPIRES_SECONDS: 60 * 60,
    SECONDS_TO_MILLISECONDS: 1000
}


/* ============================== 
    認証 関連
============================== */

export const EMAIL_VERIFICATION_PAGE_TYPES = {
    EMAIL_RESET_PASSWORD_PAGE: 'reset-password',
    EMAIL_UPDATE_EMAIL_PAGE: 'update-email',
};

export const EMAIL_VERIFICATION_TYPES = {
    CREATE_ACCOUNT_TYPE: 'create-account',
    RESET_PASSWORD_TYPE: EMAIL_VERIFICATION_PAGE_TYPES.EMAIL_RESET_PASSWORD_PAGE,
    UPDATE_EMAIL_TYPE: EMAIL_VERIFICATION_PAGE_TYPES.EMAIL_UPDATE_EMAIL_PAGE,
};

export const VERIFY_EMAIL_TYPES = {
    VERIFY_CREATE_ACCOUNT: EMAIL_VERIFICATION_TYPES.CREATE_ACCOUNT_TYPE,
    VERIFY_UPDATE_EMAIL: EMAIL_VERIFICATION_PAGE_TYPES.EMAIL_UPDATE_EMAIL_PAGE,
};

export const VERIFICATION_STATUS = {
    STATUS_LOADING: BASE_STATUS.LOADING,
    STATUS_SUCCESS: BASE_STATUS.SUCCESS,
    STATUS_ERROR: BASE_STATUS.ERROR,
};


/* ============================== 
    Auth 関連
============================== */

// セッションの有効期限（24時間）
export const SESSION_MAX_AGE = 24 * 60 * 60;

// 認証トークンのバイト数
export const AUTH_TOKEN_BYTES = 32;
export const PASSWORD_HASH_ROUNDS = 12;

// ログイン時のリダイレクトのタイムアウト
export const LOGIN_REDIRECT_TIMEOUT = 100;

// メールアドレスの認証トークンの有効期限
export const EMAIL_VERIFICATION_TOKEN_CONFIG = {
    EXPIRATION_TIME: 60 * 60 * 1000, // 1 hours
    EXPIRATION_TEXT: 1,
}

// 認証の種類
export const AUTH_TYPES = {
    AUTH_LOGIN: 'login',
    AUTH_REAUTHENTICATE: 'reauthenticate'
};


/* ============================== 
    User 関連
============================== */

// メールアドレスの編集のステップ
export const EDIT_EMAIL_STEP = {
    EMAIL_REAUTHENTICATE: 'reauthenticate',
    EMAIL_EDIT: 'edit-email',
};

// パスワードの編集のステップ
export const EDIT_PASSWORD_STEP = {
    PASSWORD_REAUTHENTICATE: EDIT_EMAIL_STEP.EMAIL_REAUTHENTICATE,
    PASSWORD_EDIT: 'edit-password',
};

// パスワード編集ページの種類
export const UPDATE_PASSWORD_PAGE_TYPES = {
    RESET_PASSWORD_PAGE: 'reset-password',
    EDIT_PASSWORD_PAGE: EDIT_PASSWORD_STEP.PASSWORD_EDIT,
};

// ユーザーデータの取得の種類
export const GET_USER_DATA_TYPES = {
    EMAIL_DATA: 'email',
    CUSTOMER_ID_DATA: 'customerId',
};


/* ============================== 
    SYNC LOG 関連
============================== */

// SYNC LOG の記事の表示制限
export const SYNC_LOG_DISPLAY_CONFIG = {
    SECTION_LIMIT: 3,
    PAGE_LIMIT: 8
}

// SYNC LOG のカテゴリー
export const SYNC_LOG_CATEGORIES = {
    SYNC_ALL: 'All',
    SYNC_UPDATES: 'Updates',
    SYNC_VOICES: 'Voices',
    SYNC_EXTRAS: 'Extras',
};

// SYNC LOG のタグのサイズ
export const SYNC_LOG_TAG_SIZES = {
    TAG_SMALL: BASE_SIZE.SMALL,
    TAG_MEDIUM: BASE_SIZE.MEDIUM,
};

// MicroCMSの設定
export const MICROCMS_CONFIG = {
    INITIAL_OFFSET: 0,
    LOG_ENDPOINT: 'logs'
}


/* ============================== 
    Products 関連
============================== */

// 商品カテゴリーのラベル
export const CATEGORY_LABELS = {
    ALL_SKILLS: 'All Skills',
    ACTIVE_SKILLS: 'Active Skills',
    EXPLORER_SKILLS: 'Explorer Skills',
    CREATIVE_SKILLS: 'Creative Skills',
    WISDOM_SKILLS: 'Wisdom Skills',
    UNIQUE_SKILLS: 'Unique Skills',
}

// 商品タグのカテゴリー
export const CATEGORY_TAGS = {
    ALL_TAG: 'All',
    ACTIVE_TAG: 'Active',
    EXPLORER_TAG: 'Explorer',
    CREATIVE_TAG: 'Creative',
    WISDOM_TAG: 'Wisdom',
    UNIQUE_TAG: 'Unique',
    RANDOM_TAG: 'Random',
};

// セクションのカテゴリー
export const SECTION_CATEGORIES = {
    ACTIVE: CATEGORY_TAGS.ACTIVE_TAG,
    EXPLORER: CATEGORY_TAGS.EXPLORER_TAG,
    CREATIVE: CATEGORY_TAGS.CREATIVE_TAG,
    WISDOM: CATEGORY_TAGS.WISDOM_TAG,
    UNIQUE: CATEGORY_TAGS.UNIQUE_TAG,
}

// カテゴリーのサブタイトル
export const CATEGORY_SUBTITLES = {
    ALL_SUBTITLE: 'スキルでパワーアップして現実世界に挑む',
    ACTIVE_SUBTITLE: '体を整えて現実の世界で勝利を掴む',
    EXPLORER_SUBTITLE: '未知の場所を目指して世界探索',
    CREATIVE_SUBTITLE: 'アイデアを研ぎ澄ませて想像力を形に',
    WISDOM_SUBTITLE: '最も鋭い知識を身に付ける',
    UNIQUE_SUBTITLE: '特殊スキルで未開拓の世界へ',
}

// コレクションの並び替え
export const COLLECTION_SORT_TYPES = {
    CREATED_DESCENDING: 'created-descending',
    BEST_SELLING: 'best-selling',
    TITLE_ASCENDING: 'title-ascending',
    TITLE_DESCENDING: 'title-descending',
    PRICE_ASCENDING: 'price-ascending',
    PRICE_DESCENDING: 'price-descending',
};

// 商品のステータス
export const PRODUCT_PRICE_STATUS = {
    PRODUCT_SALE: 'Sale',
    PRODUCT_SOLDOUT: 'Sold Out',
};

// 商品ステータスのサイズ
export const PRODUCT_STATUS_SIZES = {
    STATUS_SMALL: BASE_SIZE.SMALL,
    STATUS_MEDIUM: BASE_SIZE.MEDIUM,
};

// 商品価格のタイプ
export const PRODUCT_PRICE_TYPES = {
    PRICE_LIST: 'list',
    PRICE_DETAIL: 'detail',
    PRICE_CART: 'cart',
};

// 商品の数量項目のサイズ
export const PRODUCT_QUANTITY_SIZES = {
    QUANTITY_MEDIUM: BASE_SIZE.MEDIUM,
    QUANTITY_LARGE: BASE_SIZE.LARGE,
};

// 商品の数量項目の設定
export const PRODUCT_QUANTITY_CONFIG = {
    DEFAULT_QUANTITY: 1,
    MIN_QUANTITY: 1,
    QUANTITY_STEP: 1,
}

// 商品の在庫数の閾値
export const PRODUCT_STOCK_THRESHOLD = 10;

// 商品価格のスライダーの設定
export const PRICE_SLIDER_CONFIG = {
    PRICE_MIN: 0,
    INITIAL_STEP: 1,
    PERCENT_BOUNDS: {
        MIN: 0,
        MAX: 1
    },
    PERCENT_MULTIPLIER: 100,
    STEP_BY_PRICE_RANGE: {
        THRESHOLD_1: 1000,
        THRESHOLD_2: 5000,
        THRESHOLD_3: 20000,
        THRESHOLD_4: 100000,
        STEP_1: 100,
        STEP_2: 500,
        STEP_3: 1000,
        STEP_4: 5000,
        STEP_5: 10000
    }
}

// 価格のスライダーのドラッグのタイプ
export const PRICE_RANGE_DRAGGING_TYPES = {
    DRAGGING_MIN: 'min',
    DRAGGING_MAX: 'max',
};

// 割引率の乗算値
export const DISCOUNT_PERCENTAGE_MULTIPLIER = 100;

// トレンド商品のステータスのサイズ
export const TREND_STATUS_SIZES = {
    TREND_STATUS_MEDIUM: BASE_SIZE.MEDIUM,
    TREND_STATUS_LARGE: BASE_SIZE.LARGE,
};

// 商品一覧の取得データの種類
export const GET_PRODUCTS_PAGE_TYPES = {
    SYNC_CONDITIONS: 'syncConditions',
    SKILL_TRAIL: 'skillTrail',
    OPTIMAL_SYNCS: 'optimalSyncs',
    CART: 'cart',
};

// トレンド商品のカテゴリー
export const TREND_CATEGORIES = Object.fromEntries(
    Object.entries(SECTION_CATEGORIES).filter(([key]) => key !== 'ALL')
);

// トレンド商品の表示制限
export const TREND_PRODUCT_SALES_VOLUME_THRESHOLD = 100000;

// 商品一覧の表示制限
export const PRODUCTS_DISPLAY_CONFIG = {
    PAGE_LIMIT: 16,
    TREND_LIMIT: 9,
    OPTIMAL_SYNCS_LIMIT: 9,
}

// Optimal Syncsのタグの種類
export const OPTIMAL_SYNC_TAG_TYPES = {
    REQUIRED_TAG: 'Required',
    OPTION_TAG: 'Option',
    PICKUP_TAG: 'Pickup',
};

// スキルの売り切れ数の表示制限
export const SYNC_SOLD_OUT_CONFIG = {
    MILLION_THRESHOLD: 1000000,
    THOUSAND_THRESHOLD: 100000,
    KILO_DIVISOR: 1000,
};


/* ============================== 
    Reviews 関連
============================== */

// レビューの受け入れファイルの種類
export const REVIEW_ACCEPTED_FILE_TYPES = {
    [FILE_MIME_TYPES.IMAGE_JPEG]: ['.jpg', '.jpeg'],
    [FILE_MIME_TYPES.IMAGE_PNG]: ['.png'],
}

// 評価の最大値
export const STAR_MAX_RATING = 5;

// レビューの表示制限
export const REVIEW_DISPLAY_CONFIG = {
    SECTION_LIMIT: 16,
    PAGE_LIMIT: 12
}

// レビューフォームの設定
export const REVIEW_FORM_CONFIG = {
    DECIMAL_PLACES: 1,
    INITIAL_TOTAL: 0,
    PERCENTAGE_MULTIPLIER: 100,
}

// レビューの画像の表示設定
export const REVIEW_IMAGE_CONFIG = {
    MAX_DISPLAY: 3,
    OVERLAY_THRESHOLD: 3,
    OVERLAY_DISPLAY_COUNT: 2
}

// レビューの統計の設定
export const INITIAL_REVIEW_STAT_CONFIG = {
    INITIAL_RATING: 0,
    RATING_COUNTS: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    ROUNDING_FACTOR: 10
}

// 評価の星のサイズ
export const STAR_RATING_SIZES_TYPES = {
    STAR_SMALL: BASE_SIZE.SMALL,
    STAR_MEDIUM: BASE_SIZE.MEDIUM,
    STAR_LARGE: BASE_SIZE.LARGE,
};

// 評価の星のサイズ
export const STAR_RATING_SIZES = {
    [STAR_RATING_SIZES_TYPES.STAR_SMALL]: { width: 14, height: 13 },
    [STAR_RATING_SIZES_TYPES.STAR_MEDIUM]: { width: 18, height: 17 },
    [STAR_RATING_SIZES_TYPES.STAR_LARGE]: { width: 20, height: 19 },
};

// 評価の星のタイプ
export const STAR_RATING_TYPES = {
    STAR_COLOR: 'color',
    STAR_MONOCHROME: 'monochrome',
};


/* ============================== 
    Bookmark 関連
============================== */

// ブックマーク一覧の表示制限
export const BOOKMARK_PAGE_DISPLAY_LIMIT = 16;

// ブックマークのURLの更新遅延
export const BOOKMARK_URL_UPDATE_DELAY = 100;

// ブックマークの操作のタイプ
export const BOOKMARK_OPERATION_TYPES = {
    BOOKMARK_POST: 'POST',
    BOOKMARK_DELETE: 'DELETE',
}


/* ============================== 
    Support Chat 関連
============================== */

// チャット履歴の削除期間
export const CHAT_HISTORY_DELETE_MONTH = 1;

// チャット履歴の初期メッセージ
export const CHAT_HISTORY_INITIAL_MESSAGE = "何かお困りごと・ご質問はございますか？\nご用件を入力してください。";

// OpenAIの設定
export const CHAT_CONFIG = {
    // 類似スコアの閾値
    SIMILARITY_THRESHOLD: 0.8,
    
    // 使用量制限
    MONTHLY_LIMIT: 1000,

    // チャット履歴の制限（個人チャットの履歴を最大20件までに制限）
    MAX_CHAT_MESSAGES: 20,
    
    // デフォルトメッセージ
    DEFAULT_HUMAN_RESPONSE: '担当者に確認中です。回答までしばらくお待ちください。（※現在このサイトは運用していないため、回答はありません）',
    
    // 追加機能のフラグ
    ENABLE_RULE_BASED: true,
    ENABLE_EMBEDDING: true,
    ENABLE_FUNCTION_CALLING: false
};

export const CHAT_SENDER_TYPES = {
    SENDER_USER: 'user',
    SENDER_ADMIN: 'admin',
}

// チャットのソース
export const CHAT_SOURCE = {
    INITIAL: 'initial',
    RULE_BASED: 'rule_based',
    EMBEDDING_SEARCH: 'embedding_search',
    STAFF_CONFIRMING: 'staff_confirming',
    HUMAN_SUPPORT: 'human_support',
    CHAT_USER: 'user',
};

export const EMBEDDING_CONFIG = {
    INITIAL_USAGE: 0,
    SEARCH_RESULTS_COUNT: 1,
} 


/* ============================== 
    カート&注文 関連
============================== */

// Stripeの配送料の無料の限度
export const STRIPE_SHIPPING_FREE_LIMIT = 10;

// 注文の初期値（カートの商品の数量）
export const CHECKOUT_INITIAL_QUANTITY = 0;

// 注文番号のパディング
export const ORDER_NUMBER_PADDING = 6;

// 注文のステータス
export const ORDER_STATUS = {
    ORDER_PENDING: 'pending',    // 保留中
    ORDER_PROCESSING: 'processing', // 未発送（発送前）
    ORDER_SHIPPED: 'shipped',    // 発送済み
    ORDER_DELIVERED: 'delivered',  // 配送完了
    ORDER_CANCELLED: 'cancelled',  // キャンセル
    ORDER_REFUNDED: 'refunded',   // 返金済み
}

// 注文履歴のカテゴリー
export const ORDER_HISTORY_CATEGORIES = {
    CATEGORY_ALL: '全て',
    CATEGORY_NOT_SHIPPED: '未発送',
    CATEGORY_SHIPPED: '発送済み',
};

// 注文履歴のページの表示制限
export const ORDER_HISTORY_PAGE_LIMIT = 8;

// お届け先の最大数
export const SHIPPING_ADDRESS_MAX_COUNT = 10;

// 支払い期限
export const PAYMENT_DUE_DATE = 7 * 24 * 60 * 60 * 1000; // 7 days

// トーストの表示遅延
export const CHECKOUT_SHOW_TOAST_DELAY = 100;

// 注文のステータスの種類
export const ORDER_DISPLAY_TYPES = {
    ORDER_LIST: 'list',
    ORDER_DETAIL: 'detail',
}

// 注文のステータスの表示タイプ
export const ORDER_STATUS_DISPLAY_TYPES = {
    STATUS: 'status',
    CARD: 'card',
}

// カート追加時の数量の初期値
export const INITIAL_CART_QUANTITY = 1;

// カートの数量の設定
export const CART_QUANTITY_CONFIG = {
    MIN_QUANTITY: 1,
    MAX_QUANTITY: 100,
    QUANTITY_CHANGE: 1
}

// カートの操作のタイプ
export const CART_OPERATION_TYPES = {
    CART_POST: 'POST',
    CART_DELETE: 'DELETE',
}


/* ============================== 
    Subscription Payment 関連
============================== */

export const SUBSCRIPTION_PAYMENT_STATUS = {
    PENDING: 'pending',
    PAST_DUE: 'past_due',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
    CANCELED: 'canceled',
}

export const SUBSCRIPTION_PAYMENT_DISPLAY = {
    MOBILE_MAX_ITEMS: 6,
    DESKTOP_MAX_ITEMS: 8,
}


/* ============================== 
    Subscription 関連
============================== */
// サブスクリプションの設定
export const SUBSCRIPTION_SETTINGS = {
    PRICE_PREFIX_LENGTH: 6, // Stripeの価格IDのプレフィックスの長さ
    BASE_RADIX: 10, // 10進数
}

// サブスクリプションの注文履歴のページの表示制限
export const SUBSCRIPTION_ORDER_HISTORY_PAGE_LIMIT = 12;

// サブスクリプションのキャンセルの期限
export const SUBSCRIPTION_CANCEL_THRESHOLD = 3;

// サブスク商品の購入タイプ
export const SUBSCRIPTION_PURCHASE_TYPES = {
    ONE_TIME: 'one-time',
    SUBSCRIPTION: 'subscription',
};

// サブスクリプションの間隔
export const SUBSCRIPTION_INTERVALS = {
    INTERVAL_DAY: 'day',
    INTERVAL_WEEK: 'week',
    INTERVAL_MONTH: 'month',
    INTERVAL_3MONTH: '3month',
    INTERVAL_6MONTH: '6month',
    INTERVAL_YEAR: 'year',
}

// サブスクリプションの間隔の閾値
export const SUBSCRIPTION_INTERVAL_THRESHOLDS = {
    THRESHOLD_3MONTH: 3,
    THRESHOLD_6MONTH: 6,
}

// サブスクリプションのステータス
export const SUBSCRIPTION_STATUS = {
    SUBS_ACTIVE: 'active',
    SUBS_CANCELLED: 'cancelled',
}

// サブスクリプションの契約履歴のカテゴリー
export const SUBSCRIPTION_HISTORY_CATEGORIES = {
    CATEGORY_SUBS_ACTIVE: '契約中',
    CATEGORY_SUBS_CANCELLED: '解約済み',
};


/* ============================== 
    その他ページ 関連
============================== */

// お問い合わせフォームのステップ
export const CONTACT_STEPS = {
    INPUT: 0,
    CONFIRM: 1,
    COMPLETE: 2
}

// お問い合わせフォームのステップのオフセット
export const CONTACT_STEP_OFFSET = 1;

// お問い合わせフォームの受け入れファイルの種類
export const CONTACT_ACCEPTED_FILE_TYPES = {
    [FILE_MIME_TYPES.IMAGE_JPEG]: ['.jpg', '.jpeg'],
    [FILE_MIME_TYPES.IMAGE_PNG]: ['.png'],
    'application/pdf': ['.pdf'],
}

// お問い合わせフォームのステップ
export const CONTACT_FORM_STEP = {
    CONTACT_FORM: 'contact-form',
    CONTACT_CHECK: 'contact-check',
    CONTACT_THANKS: 'contact-thanks',
};

// フォームのデフォルトの都道府県
export const FORM_DEFAULT_STATE = '北海道';

// 検索ページの表示制限
export const SEARCH_PAGE_DISPLAY_LIMIT = 16;

// 検索フォームのサイズ
export const SEARCH_FORM_SIZES = {
    SEARCH_MEDIUM: BASE_SIZE.MEDIUM,
    SEARCH_LARGE: BASE_SIZE.LARGE,
};

// テキストエリアのスキーマのタイプ
export const TEXTAREA_SCHEMA_TYPES = {
    TEXTAREA_TYPE: 'textarea',
    REVIEW_TYPE: 'review',
};