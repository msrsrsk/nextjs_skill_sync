import { CHAT_CONFIG, FILE_UPLOAD_CONFIG } from "@/constants/index"

const { MAX_CHAT_MESSAGES } = CHAT_CONFIG;
const { MAX_ACCOUNT_INFO_ICON_SIZE_TEXT } = FILE_UPLOAD_CONFIG;

const SUFFIXES = {
    AUTH: '\n再度ログインしてください。',
    LOGIN: '\nログインをして再度お試しください。',
    RETRY: '\n時間をおいて再度お試しください。',
    FIRST: '\nもう一度最初からお試しください。',
};

const { AUTH, LOGIN, RETRY, FIRST } = SUFFIXES;

export const ERROR_MESSAGES = {
    // 共通エラー
    ALREADY_SAVED_MESSAGE: '既に保存済みのデータです',
    DATABASE_ERROR: `データベースエラーが発生しました。${RETRY}`,
    
    // 認証関連
    AUTH_ERROR: {
        REQUIRED_LOGIN: `ログインが必要です。`,
        SESSION_NOT_FOUND: `セッションが見つかりません。${AUTH}`,
        USER_NOT_FOUND: `ユーザーが見つかりません。${AUTH}`,
        EMAIL_EXISTS: `そのメールアドレスはご利用できません。もう一度ご確認ください。`,
        SIGN_IN_FAILED: `ログインできませんでした。${FIRST}`,
        EMAIL_NOT_MATCH: `現在のメールアドレスと一致しません。${FIRST}`,
        INCORRECT_EMAIL_OR_PASSWORD: `メールアドレスまたはパスワードが正しくありません。${FIRST}`,
        CREATE_ACCOUNT_PROCESS_FAILED: `アカウントの作成中に問題が発生しました。${FIRST}`,
        CREATE_ACCOUNT_FAILED: `アカウント作成が上手くいきませんでした。${FIRST}`,
        
        TOKEN_CREATE_FAILED: `認証メールの送信に必要な情報がありません。${FIRST}`,
        TOKEN_SEND_FAILED: `認証メールの送信に失敗しました。${FIRST}`,
        NOT_FOUND_TOKEN: `メール認証のための必要な\n情報が見つかりませんでした。${FIRST}`,
        EXPIRED_EMAIL_TOKEN: `メール認証の有効期限が過ぎたため、\nアカウントの作成ができませんでした。${FIRST}`,
        TOKEN_SEND_PROCESS_FAILED: `認証メールの送信時に問題が発生しました。${FIRST}`,
        REAUTHENTICATE_FAILED: `認証に失敗しました。${FIRST}`,
        FAILED_EMAIL_TOKEN_PROCESS: `メールアドレスの認証処理中にエラーが発生しました。${FIRST}`,

        PASSWORD_NOT_FOUND: `パスワード情報が見つかりませんでした。${FIRST}`,
        NOT_FOUND_PASSWORD_TOKEN: `パスワードリセットのための\n必要な情報が見つかりませんでした。${FIRST}`,
        EXPIRED_PASSWORD_TOKEN: `パスワードリセットの有効期限が過ぎました。${FIRST}`,
        FAILED_PASSWORD_TOKEN_PROCESS: `パスワードリセットの認証処理中にエラーが発生しました。${FIRST}`,
    },

    // ユーザー関連
    USER_ERROR: {
        UNAUTHORIZED: `アカウントの削除はログインが必要です。${LOGIN}`,
        ICON_UPDATE_UNAUTHORIZED: `アイコンの更新はログインが必要です。${LOGIN}`,
        NAME_UPDATE_UNAUTHORIZED: `お名前の更新はログインが必要です。${LOGIN}`,
        TEL_UPDATE_UNAUTHORIZED: `電話番号の更新はログインが必要です。${LOGIN}`,

        CREATE_ACCOUNT_FAILED: `アカウントの作成に失敗しました。${RETRY}`,
        FETCH_FAILED: `ユーザー情報の取得に失敗しました。${RETRY}`,

        CUSTOMER_ID_FETCH_FAILED: `お届け先の設定に必要な情報が不足しています。${RETRY}`,
        ICON_UPDATE_MISSING_DATA: `アイコンの更新に必要なデータの取得ができませんでした。${RETRY}`,
        NAME_UPDATE_MISSING_DATA: `お名前の更新に必要なデータの取得ができませんでした。${RETRY}`,
        TEL_UPDATE_MISSING_DATA: `電話番号の更新に必要なデータの取得ができませんでした。${RETRY}`,
        PASSWORD_RESET_MISSING_DATA: `パスワードリセットのための\n必要な情報が見つかりませんでした。${RETRY}`,
        
        MAIL_UPDATE_FAILED: `メールアドレスの更新に失敗しました。${RETRY}`,
        PASSWORD_UPDATE_FAILED: `パスワードの更新に失敗しました。${RETRY}`,

        EXPIRED_PASSWORD_TOKEN: `パスワードリセットの有効期限が過ぎました。${FIRST}`,
        DELETE_FAILED: `アカウントの削除に失敗しました。${RETRY}`,
        DELETE_IMAGE_FAILED: `アイコンの削除に失敗しました。${RETRY}`,

        UNSHIPPED_ORDERS_COUNT_MISSING_DATA: `アカウントの削除に必要なデータの取得に失敗しました。${RETRY}`,
        UNSHIPPED_ORDERS_COUNT_WARNING: `未発送の注文が残っています。全て発送済みであることをご確認の上、退会手続を進めてください。`,

        FILE_SIZE_EXCEEDED: `ファイルサイズは${MAX_ACCOUNT_INFO_ICON_SIZE_TEXT}以下にしてください`,
    },

    // ユーザープロフィール関連
    USER_PROFILE_ERROR: {
        ICON_UPDATE_FAILED: `アイコンの更新に失敗しました。${RETRY}`,
        NAME_UPDATE_FAILED: `お名前の更新に失敗しました。${RETRY}`,
        TEL_UPDATE_FAILED: `電話番号の更新に失敗しました。${RETRY}`,

        DELETE_FAILED: `ユーザープロフィールの削除に失敗しました。${RETRY}`,
    },

    // 商品関連
    PRODUCT_ERROR: {
        NOT_FOUND: `商品が見つかりません。${RETRY}`,
        NOT_FOUND_IDS: `商品IDが見つかりませんでした。${RETRY}`,
        
        NO_IDS: `商品IDの取得に失敗しました。${RETRY}`,
        FETCH_FAILED: `商品データの取得に失敗しました。${RETRY}`,
        STRIPE_FETCH_FAILED: `Stripeの商品データの取得に失敗しました。${RETRY}`,
        DETAIL_FETCH_FAILED: `商品詳細データの取得に失敗しました。${RETRY}`,
        IDS_FETCH_FAILED: `商品IDによるデータ取得に失敗しました。${RETRY}`,
        PRICE_FETCH_FAILED: `商品の価格データの取得に失敗しました。${RETRY}`,
        TREND_FETCH_FAILED: `トレンド商品のデータ取得に失敗しました。${RETRY}`,

        SKILL_TRAIL_FETCH_FAILED: `最近見た商品のデータ取得に失敗しました。${RETRY}`,
        ADD_SKILL_TRAIL_FAILED: `最近見た商品の追加に失敗しました。${RETRY}`,
        DELETE_SKILL_TRAIL_FAILED: `最近見た商品の削除に失敗しました。${RETRY}`,

        UPDATE_FAILED: `商品の更新に失敗しました。${RETRY}`,
        UPDATE_STOCK_AND_SOLD_COUNT_FAILED: `商品の在庫数と売り上げ数の更新に失敗しました。${RETRY}`,

        REMOVE_SUCCESS: 'スキルを削除しました',

        STOCK_WEBHOOK_PROCESS_FAILED: '商品在庫のWebhook処理中にエラーが発生しました。',
        STRIPE_WEBHOOK_PROCESS_FAILED: 'Stripeデータ作成のWebhook処理中にエラーが発生しました。',
    },

    // レビュー関連
    REVIEW_ERROR: {
        FETCH_FAILED: `レビューデータの取得に失敗しました。${RETRY}`,
        REVIEW_IMAGE_FETCH_FAILED: `レビューの画像データの取得に失敗しました。${RETRY}`,
        POST_FAILED: `レビューの投稿に失敗しました。${FIRST}`,
        CREATE_FAILED: `レビューの保存に失敗しました。${RETRY}`,
        INDIVIDUAL_FETCH_FAILED: `個別商品のレビューの取得に失敗しました。${RETRY}`,

        WEBHOOK_PROCESS_FAILED: 'レビューのWebhook処理中にエラーが発生しました。',
        WEBHOOK_INSERT_FAILED: 'レビュー作成時のデータが見つかりませんでした。',
        WEBHOOK_INSERT_PROCESS_FAILED: 'レビュー作成時のWebhook処理中にエラーが発生しました。',
        WEBHOOK_DELETE_FAILED: 'レビュー削除時のデータが見つかりませんでした。',
        WEBHOOK_DELETE_PROCESS_FAILED: 'レビュー削除時のWebhook処理中にエラーが発生しました。',
    },

    // お気に入り関連
    BOOKMARK_ERROR: {
        ADD_UNAUTHORIZED: `お気に入りの登録はログインが必要です。${LOGIN}`,
        REMOVE_UNAUTHORIZED: `お気に入りの削除はログインが必要です。${LOGIN}`,

        OPERATION_FAILED: `お気に入りボタンの操作に失敗しました。${RETRY}`,

        FETCH_FAILED: `お気に入りデータの取得に失敗しました。${RETRY}`,
        ADD_MISSING_DATA: `お気に入りデータの変更に必要な情報が不足しています。${RETRY}`,
        REMOVE_MISSING_DATA: `お気に入りデータの削除に必要な情報が不足しています。${RETRY}`,
        FETCH_PRODUCT_FAILED: `お気に入り状態の取得に失敗しました。${RETRY}`,

        ADD_FAILED: `お気に入りの追加に失敗しました。${RETRY}`,

        REMOVE_FAILED: `お気に入りの削除に失敗しました。${RETRY}`,
        REMOVE_ALL_FAILED: `全てのお気に入りの削除に失敗しました。${RETRY}`,
        
        REMOVE_INDIVIDUAL_SUCCESS: 'お気に入りを削除しました',
        REMOVE_ALL_SUCCESS: '全てのお気に入りを削除しました',
    },

    // チャット関連
    CHAT_ERROR: {
        UNAUTHORIZED: `チャットはログインが必要です。${LOGIN}`,
        MISSING_DATA: `メッセージが入力されていません。${FIRST}`,
        SEND_FAILED: `チャットメッセージの送信に失敗しました。${RETRY}`,
        MISSING_CHAT_ROOM: `チャットルームが見つかりません。${LOGIN}`,
        CREATE_FAILED: `チャットメッセージの保存に失敗しました。${RETRY}`,
        FETCH_FAILED: `チャット履歴の取得に失敗しました。${RETRY}`,

        FAILED_SAVE_AI_MESSAGE: `AIからの回答の保存に失敗しました。${RETRY}`,
        
        MONTHLY_LIMIT_EXCEEDED: `月間使用量の上限に達しました。\nまた翌月お試しください。`,
        LIMIT_WARNING: `チャットメッセージの送信は履歴も含めて最大${MAX_CHAT_MESSAGES}件までです。古いメッセージが自動削除されるまでしばらくお待ちください。`,
        EMBEDDING_SEARCH_FAILED: `類似テンプレートの検索に失敗しました。${RETRY}`,
        OPENAI_API_KEY_NOT_SET: `OpenAIのAPIキーが設定されていません。`,

        WEBHOOK_PROCESS_FAILED: 'チャットのWebhook処理中にエラーが発生しました。',
    },

    // カート関連
    CART_ITEM_ERROR: {
        UNAUTHORIZED: `カートの商品リストの作成はログインが必要です。${LOGIN}`,
        CREATE_FAILED: `カートの商品リストの作成に失敗しました。${RETRY}`,
        NO_PRODUCT_DATA: `カートの商品リストの作成のための必要な情報が不足しています。${RETRY}`,

        FETCH_FAILED: `カートの商品リストの取得に失敗しました。${RETRY}`,
        ADD_FAILED: `カートの商品追加に失敗しました。${RETRY}`,
        DELETE_FAILED: `カートの商品リストの削除に失敗しました。${RETRY}`,
        DELETE_ALL_FAILED: `カートの全ての商品リストの削除に失敗しました。${RETRY}`,
        UPDATE_QUANTITY_FAILED: `商品の数量変更に失敗しました。${RETRY}`,
        FETCH_SUBTOTAL_FAILED: `カートの合計金額の取得に失敗しました。${RETRY}`,
    },

    // カート&チェックアウト関連
    CHECKOUT_ERROR: {
        NO_CART_ITEMS: 'カートに商品が入っていません。',

        NO_PRODUCT_DATA: `商品データが見つかりません。${RETRY}`,
        NO_PRICE_ID: `商品の価格データが見つかりません。${RETRY}`,
        CUSTOMER_ID_UPDATE_FAILED: `StripeIDの更新に失敗しました。${FIRST}`,

        STOCK_CHECK_FAILED: `在庫チェックのための必要な情報が不足しています。${RETRY}`,
        FAILED_CHECK_STOCK: `商品の在庫チェックに失敗しました。${RETRY}`,
        UPDATE_STOCK: `在庫状況を更新いたしました。注文数を再度ご確認の上、チェックアウトに進んでください。`,

        CHECKOUT_SESSION_FAILED: `チェックアウトの作成に失敗しました。${RETRY}`,
        CHECKOUT_PRODUCT_CREATE_FAILED: `チェックアウトの商品リストの作成に失敗しました。${RETRY}`,
        NOT_PROCEED_CHECKOUT: `チェックアウトに進めませんでした。${RETRY}`,
        WEBHOOK_PROCESS_FAILED: 'チェックアウトの処理中にエラーが発生しました。',

        CHECKOUT_COMPLETED_FAILED: `チェックアウト完了時の処理中にエラーが発生しました。${RETRY}`,
        SUBSCRIPTION_EVENT_FAILED: `サブスクリプションの注文処理中にエラーが発生しました。${RETRY}`,
        
        FETCH_SUBSCRIPTION_FAILED: `サブスクリプションの契約状況の取得に失敗しました。${RETRY}`,
        NO_SUBSCRIPTION_PRICE: `サブスクリプション商品の購入で必要な情報が不足しています。${RETRY}`,
        NO_SUBSCRIPTION_INTERVAL: `サブスクリプションの支払いリンクの作成で必要な情報が不足しています。${RETRY}`,
        PAYMENT_LINK_FAILED: `サブスクリプションの支払いリンクの作成に失敗しました。${RETRY}`,
        PAYMENT_LINK_DEACTIVATE_FAILED: `サブスクリプションの支払いリンクの無効化に失敗しました。${RETRY}`,
        NOT_PROCEED_PAYMENTLINK: `サブスクリプションの支払いリンクの作成に進めませんでした。${RETRY}`,
        ALREADY_SUBSCRIBED: `既に該当商品のサブスクリプションを契約済みです。変更や解除はアカウントページで行ってください。`,

        GET_ORDER_DATA_FAILED: `注文データの取得に失敗しました。${RETRY}`,
        CREATE_ORDER_FAILED: `注文履歴の保存に失敗しました。${RETRY}`,
        CREATE_ORDER_STRIPE_FAILED: `注文履歴のStripeデータの作成に失敗しました。${RETRY}`,
        CREATE_ORDER_ITEMS_FAILED: `注文の商品リストの保存に失敗しました。${RETRY}`,
        CREATE_ORDER_ITEM_STRIPES_FAILED: `注文の商品リストのStripeデータの保存に失敗しました。${RETRY}`,
        UPDATE_STOCK_AND_SOLD_COUNT_FAILED: `商品の在庫数と売り上げ数の更新に失敗しました。${RETRY}`,
        GET_DEFAULT_SHIPPING_ADDRESS_FAILED: `デフォルトの配送先住所の取得に失敗しました。${RETRY}`,
        CREATE_DEFAULT_SHIPPING_ADDRESS_FAILED: `デフォルトの配送先住所の保存に失敗しました。${RETRY}`,
        CREATE_SHIPPING_ADDRESS_FAILED: `配送先住所の保存に失敗しました。${RETRY}`,
        UPDATE_CUSTOMER_ADDRESS_FAILED: `顧客の配送先住所の更新に失敗しました。${RETRY}`,
        SEND_ORDER_COMPLETE_EMAIL_FAILED: `注文完了メールの送信に失敗しました。${RETRY}`,
        SEND_PAYMENT_REQUEST_EMAIL_FAILED: `お支払いのお願いメールの送信に失敗しました。${RETRY}`,
    },

    // 注文関連
    ORDER_ERROR: {
        HISTORY_FETCH_FAILED: `注文履歴の取得に失敗しました。${RETRY}`,
        DETAIL_FETCH_FAILED: `注文の詳細データの取得に失敗しました。${RETRY}`,
        CREATE_FAILED: `注文履歴の作成に失敗しました。${RETRY}`,
        CREATE_STRIPE_FAILED: `注文履歴のStripeデータの作成に失敗しました。${RETRY}`,
        DELETE_FAILED: `注文の削除に失敗しました。${RETRY}`,
        DELETE_STRIPE_FAILED: `注文履歴のStripeデータの削除に失敗しました。${RETRY}`,
    },

    // 注文商品リスト関連
    ORDER_ITEM_ERROR: {
        DELETE_FAILED: `注文商品リストの削除に失敗しました。${RETRY}`,
    },

    // ユーザー画像関連
    USER_IMAGE_ERROR: {
        FILE_PATH_UPDATE_FAILED: `画像ファイルのパスの更新に失敗しました。${RETRY}`,
        USER_REQUIRED_DATA_NOT_FOUND: `画像ストレージのアクセスに必要なデータが不足しています。${RETRY}`,
        USER_ID_NOT_FOUND: `画像ストレージへのアクセス権限がありません。ログインをして再度お試しください。`,
    },
    
    // サブスクリプション関連
    SUBSCRIPTION_ERROR: {
        NO_SUBSCRIPTION_ID: `サブスクリプションのIDが見つかりませんでした。${RETRY}`,
        CREATE_FAILED: `サブスクリプションの支払いデータの作成に失敗しました。${RETRY}`,
        GET_LATEST_FAILED: `サブスクリプションの最新の支払いデータの取得に失敗しました。${RETRY}`,
        UPDATE_FAILED: `サブスクリプションの支払いデータの更新に失敗しました。${RETRY}`,
        FAILED_CHECK_SUBSCRIPTION: `サブスクリプションの注文状況の取得に失敗しました。${RETRY}`,
        NO_SUBSCRIPTION_ORDER_NUMBER: `サブスクリプションの注文番号が見つかりませんでした。${RETRY}`,
        NEXT_PAYMENT_DATE_FAILED: `次回支払日の取得に失敗しました。${RETRY}`,
        WEBHOOK_PROCESS_FAILED: 'サブスクリプションの処理中にエラーが発生しました。',
        CANCEL_SUBSCRIPTION_FAILED: `サブスクリプションのキャンセル中にエラーが発生しました。${RETRY}`,
        UPDATE_SUBSCRIPTION_STATUS_FAILED: `サブスクリプションの契約状況の更新に失敗しました。${RETRY}`,
        CANCEL_SUBSCRIPTION_SUCCESS: 'サブスクリプションの契約をキャンセルしました',

        SUBSCRIPTION_PRICE_RECURRING_CONFIG_FETCH_FAILED: `サブスクリプションの価格周期データの取得に失敗しました。${RETRY}`,
        SUBSCRIPTION_PRICE_CREATE_FAILED: `サブスクリプションの価格データの作成に失敗しました。${RETRY}`,
    },
    
    // 住所関連
    SHIPPING_ADDRESS_ERROR: {
        ADD_UNAUTHORIZED: `住所の登録はログインが必要です。${LOGIN}`,
        UPDATE_UNAUTHORIZED: `住所の更新はログインが必要です。${LOGIN}`,
        UPDATE_DEFAULT_UNAUTHORIZED: `お届け先の更新はログインが必要です。${LOGIN}`,

        RESIST_FAILED: `住所の登録に失敗しました。${RETRY}`,
        CREATE_FAILED: `住所の保存に失敗しました。${RETRY}`,
        SET_DEFAULT_FAILED: `お届け先の設定に失敗しました。${RETRY}`,
        MISSING_ID: `更新対象の住所IDが見つかりません。${RETRY}`,

        UPDATE_FAILED: `住所の更新に失敗しました。${RETRY}`,
        UPDATE_DEFAULT_FAILED: `お届け先の住所の更新に失敗しました。${RETRY}`,
        
        INDIVIDUAL_FETCH_FAILED: `個別住所のデータの取得に失敗しました。${RETRY}`,
        ALL_FETCH_FAILED: `全ての住所データの取得に失敗しました。${RETRY}`,

        DELETE_UNAUTHORIZED: `住所の削除はログインが必要です。${LOGIN}`,
        DELETE_MISSING_DATA: `住所の削除に必要な情報が不足しています。${RETRY}`,
        DELETE_FAILED: `住所の削除に失敗しました。${RETRY}`,
    },

    // 記事関連
    LOG_ERROR: {
        FETCH_FAILED: `記事ログの取得に失敗しました。${RETRY}`,
        DETAIL_FETCH_FAILED: `記事ログの詳細データの取得に失敗しました。${RETRY}`,
    },

    // メール関連
    EMAIL_ERROR: {
        AUTH_SEND_FAILED: "認証メールの送信に失敗しました",
        CHAT_SEND_FAILED: "チャットの通知メールの送信に失敗しました",
        ORDER_SEND_FAILED: "注文確認のメールの送信に失敗しました",
        CONTACT_SEND_FAILED: "お問い合わせのメールの送信に失敗しました",
        PAYMENT_REQUEST_SEND_FAILED: "お支払いのお願いのメールの送信に失敗しました",
        REVIEW_SEND_FAILED: "レビューの通知メールの送信に失敗しました",
        STOCK_SEND_FAILED: "在庫の通知メールの送信に失敗しました",
        SUBSCRIPTION_PAYMENT_REQUEST_SEND_FAILED: "サブスクリプションのお支払いのお願いのメールの送信に失敗しました",
    },

    // 支払い関連
    PAYMENT_ERROR: {
        CARD_DECLINED: "使用拒否",
        EXPIRED_CARD: "有効期限切れ",
        INCORRECT_CVC: "セキュリティーコードエラー",
        PROCESSING_ERROR: "処理中にエラー発生",
        RATE_LIMIT: "リクエスト過多",
        AUTHENTICATION_REQUIRED: "認証不足",
        INSUFFICIENT_FUNDS: "残高不足",
        CARD_NOT_SUPPORTED: "不正なカードです",
        CURRENCY_NOT_SUPPORTED: "不正な通貨です",
        FRAUDULENT: "不正利用の可能性あり",
        LOST_CARD: "紛失したカードです",
        STOLEN_CARD: "盗難したカードです",
        GENERIC_DECLINE: "使用拒否",
        DO_NOT_HONOR: "使用拒否",
        CALL_ISSUER: "カード発行会社にお問い合わせ",
        PICKUP_CARD: "回収されたカードです",
        INVALID_AMOUNT: "無効な金額",
        DUPLICATE_TRANSACTION: "重複した取引",
        CARD_VELOCITY_EXCEEDED: "カードの利用回数制限超過",
        UNKNOWN: "不明なエラー",
    },

    // Supabase関連
    SUPABASE_ERROR: {
        UPLOAD_FAILED: `画像のアップロードに失敗しました。${FIRST}`,
        CONVERT_FAILED: `画像の変換に失敗しました`,
        DELETE_MISSING_DATA: `画像の削除に必要なデータが不足しています。`,
        DELETE_FAILED: `画像の削除に失敗しました`,
    },

    // Stripe関連
    STRIPE_ERROR: {
        CUSTOMER_CREATE_FAILED: `Stripeの顧客データの作成に失敗しました。${RETRY}`,
        PRODUCT_CREATE_FAILED: `Stripeの商品データの作成に失敗しました。${RETRY}`,
        PRICE_CREATE_FAILED: `Stripeの価格データの作成に失敗しました。${RETRY}`,
        SHIPPING_RATE_AMOUNT_FETCH_FAILED: `配送料の金額の取得に失敗しました。${RETRY}`,
        CANCEL_SUBSCRIPTION_FAILED: `サブスクリプションのキャンセルに失敗しました。${RETRY}`,
    },

    // Webhook関連（共通）
    WEBHOOK_ERROR: {
        SKIP_PROCESS: '条件を満たさないため、Webhookの処理がスキップされました。',
        PROCESS_FAILED: 'Webhookの処理中にエラーが発生しました。',
    },

    // Cloudflare関連
    CLOUDFLARE_ERROR: {
        R2_UPLOAD_FAILED: `ストレージへの画像アップロードに失敗しました。${RETRY}`,
        PROFILE_ACCESS_DENIED: 'プロフィール画像へのアクセスが拒否されました。',
        FETCH_FAILED: `プロフィール画像の取得に失敗しました。${RETRY}`,
        DELETE_FAILED: `プロフィール画像の削除に失敗しました。${RETRY}`,
        USER_ID_NOT_FOUND: `画像ストレージへのアクセス権限がありません。ログインをして再度お試しください。`,
    },
}