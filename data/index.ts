import { SYNC_LOG_CATEGORIES, SITE_MAP } from "@/constants/index"

const { 
    SYNC_LOG_PATH, 
    SYNC_LOG_UPDATES_PATH, 
    SYNC_LOG_VOICES_PATH, 
    SYNC_LOG_EXTRAS_PATH,
    ICON_PATH,
} = SITE_MAP;

const { SYNC_ALL, SYNC_UPDATES, SYNC_VOICES, SYNC_EXTRAS } = SYNC_LOG_CATEGORIES;

export const syncLogConfig = {
    [SYNC_ALL]: {
        path: SYNC_LOG_PATH,
    },
    [SYNC_UPDATES]: {
        path: `${SYNC_LOG_UPDATES_PATH}`,
    },
    [SYNC_VOICES]: {
        path: `${SYNC_LOG_VOICES_PATH}`,
    },
    [SYNC_EXTRAS]: {
        path: `${SYNC_LOG_EXTRAS_PATH}`,
    }
}

export const accountInfoIconImages = [
    {
        title: "アバター１",
        src: `${ICON_PATH}/avatar01.png`,
    },
    {
        title: "アバター２",
        src: `${ICON_PATH}/avatar02.png`,
    },
    {
        title: "アバター３",
        src: `${ICON_PATH}/avatar03.png`,
    },
    {
        title: "アバター４",
        src: `${ICON_PATH}/avatar04.png`,
    },
    {
        title: "アバター５",
        src: `${ICON_PATH}/avatar05.png`,
    },
    {
        title: "キャラクター１",
        src: `${ICON_PATH}/character01.png`,
    },
    {
        title: "キャラクター２",
        src: `${ICON_PATH}/character02.png`,
    },
    {
        title: "キャラクター３",
        src: `${ICON_PATH}/character03.png`,
    },
    {
        title: "キャラクター４",
        src: `${ICON_PATH}/character04.png`,
    },
    {
        title: "キャラクター５",
        src: `${ICON_PATH}/character05.png`,
    }
]

export const formStates = [
    {
        label: "北海道",
        value: "北海道",
    },
    {
        label: "青森県",
        value: "青森県",
    },
    {
        label: "岩手県",
        value: "岩手県",
    },
    {
        label: "宮城県",
        value: "宮城県",
    },
    {
        label: "秋田県",
        value: "秋田県",
    },
    {
        label: "山形県",
        value: "山形県",
    },
    {
        label: "福島県",
        value: "福島県",
    },
    {
        label: "茨城県",
        value: "茨城県",
    },
    {
        label: "栃木県",
        value: "栃木県",
    },
    {
        label: "群馬県",
        value: "群馬県",
    },
    {
        label: "埼玉県",
        value: "埼玉県",
    },
    {
        label: "千葉県",
        value: "千葉県",
    },
    {
        label: "東京都",
        value: "東京都",
    },
    {
        label: "神奈川県",
        value: "神奈川県",
    },
    {
        label: "新潟県",
        value: "新潟県",
    },
    {
        label: "富山県",
        value: "富山県",
    },
    {
        label: "石川県",
        value: "石川県",
    },
    {
        label: "福井県",
        value: "福井県",
    },
    {
        label: "山梨県",
        value: "山梨県",
    },
    {
        label: "長野県",
        value: "長野県",
    },
    {
        label: "岐阜県",
        value: "岐阜県",
    },
    {
        label: "静岡県",
        value: "静岡県",
    },
    {
        label: "愛知県",
        value: "愛知県",
    },
    {
        label: "三重県",
        value: "三重県",
    },
    {
        label: "滋賀県",
        value: "滋賀県",
    },
    {
        label: "京都府",
        value: "京都府",
    },
    {
        label: "大阪府",
        value: "大阪府",
    },
    {
        label: "兵庫県",
        value: "兵庫県",
    },
    {
        label: "奈良県",
        value: "奈良県",
    },
    {
        label: "和歌山県",
        value: "和歌山県",
    },
    {
        label: "鳥取県",
        value: "鳥取県",
    },
    {
        label: "島根県",
        value: "島根県",
    },
    {
        label: "岡山県",
        value: "岡山県",
    },
    {
        label: "広島県",
        value: "広島県",
    },
    {
        label: "山口県",
        value: "山口県",
    },
    {
        label: "徳島県",
        value: "徳島県",
    },
    {
        label: "香川県",
        value: "香川県",
    },
    {
        label: "愛媛県",
        value: "愛媛県",
    },
    {
        label: "高知県",
        value: "高知県",
    },
    {
        label: "福岡県",
        value: "福岡県",
    },
    {
        label: "佐賀県",
        value: "佐賀県",
    },
    {
        label: "長崎県",
        value: "長崎県",
    },
    {
        label: "熊本県",
        value: "熊本県",
    },
    {
        label: "大分県",
        value: "大分県",
    },
    {
        label: "宮崎県",
        value: "宮崎県",
    },
    {
        label: "鹿児島県",
        value: "鹿児島県",
    },
    {
        label: "沖縄県",
        value: "沖縄県",
    }
];

export const deleteAccountCheckList = [
    {
        id: "account",
        label: "アカウント情報について",
        items: [
            "一度退会手続きが完了したアカウントの確認や復元ができなくなることに同意します。",
            "退会後は同じメールアドレスで再登録してもデータの引き継ぎができないことに同意します。"
        ]
    },
    {
        id: "review",
        label: "レビューについて",
        items: [
            "レビューの投稿履歴も削除されることに同意します。"
        ]
    },
    {
        id: "order",
        label: "注文済みスキルについて",
        items: [
            "必須スキルの購入履歴も全て削除されるため、再登録後に必要な場合は再購入の必要があることを理解しました。",
            "既に購入済みのスキルは有効期限内であればそのまま装備が可能なことを理解しました。"
        ]
    },
    {
        id: "end",
        label: "最後に",
        items: [
            "アカウントとスキルの記録を削除し、この世界から離脱する覚悟ができました。"
        ]
    },
]

// お問い合わせフォームのステータス
export const CONTACT_STATUS = ['入力確認', '内容確認', '送信完了'];