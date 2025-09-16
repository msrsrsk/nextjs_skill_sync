import { SITE_MAP } from "@/constants/index"

const { 
    HOME_PATH,
    ORDER_COMPLETE_PATH,
    CART_PATH,
    CONTACT_PATH,
    FAQ_PATH,
    NOT_AVAILABLE_PATH,
    REVIEW_PATH,
    SEARCH_PATH,
    TERMS_PATH,
    PRIVACY_PATH,
    TOKUSHOHO_PATH
} = SITE_MAP;

export const MAIN_METADATA = {
    HOME: {
        title: 'スキルをシェアする時代へ',
        url: HOME_PATH,
    },
    CART_ORDER_COMPLETE: {
        title: '注文完了',
        description: 'ご注文ありがとうございます。ご登録のメールアドレス宛にご注文の確認メールをお送りいたしました。',
        url: ORDER_COMPLETE_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    CART: {
        title: 'お客様のカート',
        description: 'カートに追加した商品の確認ができます。カートの商品追加や注文手続きを行うためにはアカウント登録が必要です。',
        url: CART_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    CONTACT: {
        title: 'お問い合わせ',
        description: '弊社に関するお問い合わせは、内容をご入力いただき「内容確認」ステップにて「送信する」ボタンをクリックしてください。',
        url: CONTACT_PATH,
    },
    FAQ: {
        title: 'よくあるご質問',
        description: 'よくあるご質問を各カテゴリー毎にまとめて掲載しています。ご確認の上、不明な点があればお問い合わせフォームよりお問い合わせください。',
        url: FAQ_PATH,
    },
    NOT_AVAILABLE: {
        title: 'Not Available',
        description: 'We appreciate your visit ! However, our service is currently not available in your country. We&apos;re sorry for the inconvenience and hope to welcome you soon.',
        url: NOT_AVAILABLE_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    PUBLIC_REVIEW: {
        title: 'レビュー一覧',
        description: 'お客様からのレビューを掲載しています。レビューを投稿するにはアカウント登録が必要です。アカウント作成またはログイン後に、各商品詳細ページにてレビュー投稿を行ってください。',
        url: REVIEW_PATH,
    },
    SEARCH: {
        title: '検索結果',
        description: '検索ワードに一致する商品結果が表示されます。検索ワードを入力の上、検索アイコンのボタンをクリックして検索を行ってください。',
        url: SEARCH_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    TERMS: {
        title: '利用規約',
        description: 'この利用規約（以下、「本規約」といいます。）は、SKILL SYNC（以下、「当社」といいます。）がこのウェブサイト上で提供するオンラインショップ（以下、「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。',
        url: TERMS_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    PRIVACY_POLICY: {
        title: 'プライバシーポリシー',
        description: 'SKILL SYNC（以下、「当社」といいます。）は、本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における，ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。',
        url: PRIVACY_PATH,
        robots: {
            index: false,
            follow: false,
        }
    },
    TOKUSHOHO: {
        title: '特定商法取引法に基づく表記',
        description: '特定商法取引法に基づく表記に関するページです。',
        url: TOKUSHOHO_PATH,
        robots: {
            index: false,
            follow: false,
        }
    }
}