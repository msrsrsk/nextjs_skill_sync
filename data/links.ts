import { 
    Twitch, 
    Instagram, 
    Facebook, 
    ReceiptText, 
    RefreshCw,
    Heart, 
    Star, 
    UserRound, 
    Truck, 
    Send, 
    MessageSquare,
    HelpCircle,
    LogOut
} from "lucide-react"
import { PinterestIcon, TwitterIcon } from "@/components/common/icons/SvgIcons"

import { SITE_MAP, CATEGORY_LABELS, CATEGORY_SUBTITLES, SYNC_LOG_CATEGORIES } from "@/constants/index"

const { 
    CATEGORY_PATH, 
    CATEGORY_ALL_PATH,
    CATEGORY_ACTIVE_PATH, 
    CATEGORY_EXPLORER_PATH, 
    CATEGORY_CREATIVE_PATH, 
    CATEGORY_WISDOM_PATH, 
    CATEGORY_UNIQUE_PATH, 
    TREND_PATH, 
    TREND_ALL_PATH,
    TREND_ACTIVE_PATH,
    TREND_EXPLORER_PATH,
    TREND_CREATIVE_PATH,
    TREND_WISDOM_PATH,
    TREND_UNIQUE_PATH,
    SYNC_LOG_PATH,
    SYNC_LOG_UPDATES_PATH,
    SYNC_LOG_VOICES_PATH,
    SYNC_LOG_EXTRAS_PATH,
    PRIVACY_PATH,
    TERMS_PATH,
    TOKUSHOHO_PATH,
    BOOK_MARK_PATH, 
    ORDER_HISTORY_PATH, 
    ACCOUNT_REVIEW_PATH, 
    ACCOUNT_INFO_PATH,
    SUBSCRIPTION_HISTORY_PATH,
    SHIPPING_INFO_PATH,
    CONTACT_PATH, 
    SUPPORT_CHAT_PATH,
    FAQ_PATH,
    DELETE_ACCOUNT_PRIVATE_PATH,
    IMAGE_PATH,
    ANOTHER_WORLD_PATH
} = SITE_MAP;
const { 
    ALL_SKILLS, 
    ACTIVE_SKILLS, 
    EXPLORER_SKILLS, 
    CREATIVE_SKILLS, 
    WISDOM_SKILLS, 
    UNIQUE_SKILLS 
} = CATEGORY_LABELS;
const { 
    ACTIVE_SUBTITLE, 
    EXPLORER_SUBTITLE, 
    CREATIVE_SUBTITLE, 
    WISDOM_SUBTITLE, 
    UNIQUE_SUBTITLE 
} = CATEGORY_SUBTITLES;
const { 
    SYNC_ALL,
    SYNC_UPDATES, 
    SYNC_VOICES, 
    SYNC_EXTRAS 
} = SYNC_LOG_CATEGORIES;

export const navLinks = [
    { 
        label: "Category", 
        href: CATEGORY_PATH,
        children: [
            { label: ALL_SKILLS, href: CATEGORY_ALL_PATH },
            { label: ACTIVE_SKILLS, href: CATEGORY_ACTIVE_PATH },
            { label: EXPLORER_SKILLS, href: CATEGORY_EXPLORER_PATH },
            { label: CREATIVE_SKILLS, href: CATEGORY_CREATIVE_PATH },
            { label: WISDOM_SKILLS, href: CATEGORY_WISDOM_PATH },
            { label: UNIQUE_SKILLS, href: CATEGORY_UNIQUE_PATH },
        ]
    },
    { 
        label: "Trend", 
        href: TREND_PATH,
        children : [
            { label: ALL_SKILLS, href: TREND_ALL_PATH },
            { label: ACTIVE_SKILLS, href: TREND_ACTIVE_PATH },
            { label: EXPLORER_SKILLS, href: TREND_EXPLORER_PATH },
            { label: CREATIVE_SKILLS, href: TREND_CREATIVE_PATH },
            { label: WISDOM_SKILLS, href: TREND_WISDOM_PATH },
            { label: UNIQUE_SKILLS, href: TREND_UNIQUE_PATH },
        ]
    },
    { 
        label: "The Sync Log",
        href: SYNC_LOG_PATH,
        children: [
            { label: SYNC_ALL, href: SYNC_LOG_PATH },
            { label: SYNC_UPDATES, href: SYNC_LOG_UPDATES_PATH },
            { label: SYNC_VOICES, href: SYNC_LOG_VOICES_PATH },
            { label: SYNC_EXTRAS, href: SYNC_LOG_EXTRAS_PATH },
        ]
    },
    { label: "Another World", href: ANOTHER_WORLD_PATH },
]

export const categoryLinks = navLinks.filter(link => 
    link.label === "Category"
);

export const trendLinks = navLinks.filter(link => 
    link.label === "Trend"
);

export const syncLogLinks = navLinks.filter(link => 
    link.label === "The Sync Log"
);

export const categorySectionLinks = [
    { 
        title: ACTIVE_SKILLS, 
        subtitle: ACTIVE_SUBTITLE,
        href: `${CATEGORY_ACTIVE_PATH}`,
        image: `${IMAGE_PATH}/category-active-img.png`,
        imageBoxClassName : "w-[186px] xl:w-[255px] -top-[10px] -right-[26px] lg-xl:-top-[4px] lg-xl:-right-[38px]",
    },
    { 
        title: EXPLORER_SKILLS, 
        subtitle: EXPLORER_SUBTITLE,
        href: `${CATEGORY_EXPLORER_PATH}`,
        image: `${IMAGE_PATH}/category-explorer-img.png`,
        imageBoxClassName : "w-[180px] xl:w-[242px] -top-[17px] -right-[13px] lg-xl:-top-[25px] lg-xl:-right-[20px]",
    },
    { 
        title: UNIQUE_SKILLS, 
        subtitle: UNIQUE_SUBTITLE,
        href: `${CATEGORY_UNIQUE_PATH}`,
        image: `${IMAGE_PATH}/hero-img.png`,
        image2: `${IMAGE_PATH}/category-unique-img.png`,
        imageBoxClassName : "w-[161px] xl:w-[251px] top-[2px] right-[7px] lg-xl:top-auto lg-xl:right-auto lg-xl:bottom-[114px] lg-xl:-left-[33px]",
        imageBoxClassName2 : "w-[210px] top-[36px] -right-[23px]",
    },
    { 
        title: CREATIVE_SKILLS, 
        subtitle: CREATIVE_SUBTITLE,
        href: `${CATEGORY_CREATIVE_PATH}`,
        image: `${IMAGE_PATH}/category-creative-img.png`,
        imageBoxClassName : "w-[181px] xl:w-[271px] -top-[14px] -right-[13px] lg-xl:-top-[19px] lg-xl:-right-[24px]",
    },
    { 
        title: WISDOM_SKILLS, 
        subtitle: WISDOM_SUBTITLE,
        href: `${CATEGORY_WISDOM_PATH}`,
        image: `${IMAGE_PATH}/category-wisdom-img.png`,
        imageBoxClassName : "w-[183px] xl:w-[254px] -top-[15px] -right-[18px] lg-xl:-top-[19px] lg-xl:-right-[36px]",
    },
]

export const footerLinks = navLinks.filter(link => 
    link.label === "Category" || link.label === "The Sync Log"
);

export const legalLinks = [
    { label: "よくあるご質問", href: `${FAQ_PATH}` },
    { label: "プライバシーポリシー", href: `${PRIVACY_PATH}` },
    { label: "利用規約", href: `${TERMS_PATH}` },
    { label: "特定商取引法に基づく表記", href: `${TOKUSHOHO_PATH}` },
]

export const commonSocialLinks = [
    { label: "Twitch", href: "/", icon: Twitch },
    { label: "X", href: "/", icon: TwitterIcon },
    { label: "Instagram", href: "/", icon: Instagram },
]

export const productSocialLinks = [
    { label: "X", icon: TwitterIcon },
    { label: "Pinterest", icon: PinterestIcon },
    { label: "Facebook", icon: Facebook },
]

export const anotherWorldLinks = [
    { 
        image: `${IMAGE_PATH}/bicycle.png`,
        label: "Bicycle", 
        href: "https://react-three-bicycle-configurator.vercel.app/", 
    },
    { 
        image: `${IMAGE_PATH}/shelf.png`,
        label: "Shelf", 
        href: "https://react-three-shelf-configurator.vercel.app/", 
    },
    { 
        image: `${IMAGE_PATH}/ecobag.png`,
        label: "Eco Bag", 
        href: "https://react-three-ecobag-configurator.vercel.app/", 
    },
]

export const accountLinks = [
    {
        title: "Shopping History",
        links: [
            {
                label: "購入履歴",
                sublabel: "Order History",
                href: `${ORDER_HISTORY_PATH}`,
                icon: ReceiptText,
                iconClassName: "w-10 h-10",
            },
            {
                label: "サブスクリプション",
                sublabel: "Subscription",
                href: `${SUBSCRIPTION_HISTORY_PATH}`,
                icon: RefreshCw,
                iconClassName: "w-8 h-8",
            },
            {
                label: "レビュー履歴",
                sublabel: "Review History",
                href: `${ACCOUNT_REVIEW_PATH}`,
                icon: Star,
                iconClassName: "w-9 h-9",
            },
        ]
    },
    {
        title: "Account Info",
        links: [
            {
                label: "お客様情報",
                sublabel: "Account Info",
                href: `${ACCOUNT_INFO_PATH}`,
                icon: UserRound,
                iconClassName: "w-9 h-9",
            },
            {
                label: "お届け先一覧",
                sublabel: "Shipping Info",
                href: `${SHIPPING_INFO_PATH}`,
                icon: Truck,
                iconClassName: "w-10 h-10",
            },
            {
                label: "お気に入りリスト",
                sublabel: "Book Mark",
                href: `${BOOK_MARK_PATH}`,
                icon: Heart,
                iconClassName: "w-9 h-9",
            },
        ]
    },
    {
        title: "Contact",
        links: [
            {
                label: "お問い合わせ",
                sublabel: "Contact",
                href: `${CONTACT_PATH}`,
                icon: Send,
                iconClassName: "w-8 h-8",
            },
            {
                label: "サポートチャット",
                sublabel: "Support Chat",
                href: `${SUPPORT_CHAT_PATH}`,
                icon: MessageSquare,
                iconClassName: "w-8 h-8",
            }
        ]
    },
    {
        title: "Others",
        links: [
            {
                label: "よくあるご質問",
                sublabel: "Faq",
                href: `${FAQ_PATH}`,
                icon: HelpCircle,
                iconClassName: "w-8 h-8",
            },
            {
                label: "退会",
                sublabel: "Delete Account",
                href: `${DELETE_ACCOUNT_PRIVATE_PATH}`,
                icon: LogOut,
                iconClassName: "w-8 h-8",
            }
        ]
    }
]