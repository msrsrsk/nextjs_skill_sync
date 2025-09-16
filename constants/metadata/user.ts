import { SITE_MAP } from "@/constants/index"

const { 
    ACCOUNT_INFO_PATH,
    SUBSCRIPTION_HISTORY_PATH,
    BOOK_MARK_PATH,
    DELETE_ACCOUNT_PRIVATE_PATH,
    EDIT_EMAIL_VERIFY_PATH,
    EDIT_EMAIL_PATH,
    EDIT_PASSWORD_VERIFY_PATH,
    EDIT_PASSWORD_PATH,
    ORDER_HISTORY_PATH,
    ACCOUNT_REVIEW_PATH,
    SHIPPING_INFO_PATH,
    SUPPORT_CHAT_PATH,
    ACCOUNT_PATH
} = SITE_MAP;

export const USER_METADATA = {
    ACCOUNT_INFO: {
        title: 'お客様情報',
        description: 'お客様の基本情報の確認や編集をすることができます。',
        url: ACCOUNT_INFO_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    BOOK_MARK: {
        title: 'お気に入りリスト',
        description: 'お客様のお気に入りリストを確認することができます。',
        url: BOOK_MARK_PATH,
    },
    DELETE_ACCOUNT_PRIVATE: {
        title: '退会手続き',
        description: 'アカウントの退会手続きページです。退会手続きの内容をご確認の上、退会手続きを行ってください。',
        url: DELETE_ACCOUNT_PRIVATE_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    EDIT_EMAIL_VERIFY: {
        title: 'メールアドレスの変更完了',
        description: 'メールアドレスの変更が完了しました。',
        url: EDIT_EMAIL_VERIFY_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    EDIT_EMAIL: {
        title: 'メールアドレスの変更',
        description: 'メールアドレスを変更するには、アカウントの再認証が必要です。',
        url: EDIT_EMAIL_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    EDIT_PASSWORD_VERIFY: {
        title: 'パスワードの変更完了',
        description: 'パスワードの変更が完了しました。',
        url: EDIT_PASSWORD_VERIFY_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    EDIT_PASSWORD: {
        title: 'パスワードの変更',
        description: 'パスワードを変更するには、アカウントの再認証が必要です。',
        url: EDIT_PASSWORD_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    ORDER_HISTORY: {
        title: '注文履歴一覧',
        description: 'お客様の注文履歴一覧を確認することができます。',
        url: ORDER_HISTORY_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    REVIEW_HISTORY: {
        title: 'レビュー履歴一覧',
        description: 'お客様のレビューの投稿履歴一覧を確認することができます。',
        url: ACCOUNT_REVIEW_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    SUBSCRIPTION_HISTORY: {
        title: 'サブスクリプション履歴一覧',
        description: 'お客様のサブスクリプションの履歴一覧を確認することができます。',
        url: SUBSCRIPTION_HISTORY_PATH,
    },
    SHIPPING_INFO: {
        title: 'お届け先一覧',
        description: 'お客様のお届け先一覧を確認することができます。',
        url: SHIPPING_INFO_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    SUPPORT_CHAT: {
        title: 'サポートチャット',
        description: 'チャットのやり取りができるページです。毎月1日に過去のチャットデータは自動的に削除されます。',
        url: SUPPORT_CHAT_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    ACCOUNT: {
        title: 'アカウント',
        description: 'お客様の購入履歴やお気に入りリスト、各登録情報を確認することができます。',
        url: ACCOUNT_PATH,
        robots: {
            index: false,
            follow: false,
        }
    }
}