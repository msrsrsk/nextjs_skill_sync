import { METADATA_TYPES } from "@/constants/index"

const { WEBSITE } = METADATA_TYPES;

// サイト情報
export const SITE_CONFIG = {
    SITE_NAME: 'SKILL SYNC (demo)',
    SITE_DESCRIPTION: 'SKILL SYNCは、"スキル"という新しい価値を販売・装備する未来型のマーケットプレイスです。',
    SITE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    SITE_OG_IMAGE: `${process.env.NEXT_PUBLIC_BASE_URL}/assets/social/og-image.png`,
    SITE_TWITTER_IMAGE: `${process.env.NEXT_PUBLIC_BASE_URL}/assets/social/twitter-image.png`,
    // SITE_TWITTER_HANDLE: '@skillsync',
}

// メタデータ
export const DEFAULT_METADATA = {
    title: {
        template: `%s | ${SITE_CONFIG.SITE_NAME}`,
        default: `${SITE_CONFIG.SITE_NAME}`,
    },
    description: SITE_CONFIG.SITE_DESCRIPTION,
    keywords: ['スキル', 'シンク', '同期'],
    authors: [{ name: 'SKILL SYNC Team' }],
    metadataBase: new URL(SITE_CONFIG.SITE_URL as string),
    openGraph: {
        title: SITE_CONFIG.SITE_NAME,
        description: SITE_CONFIG.SITE_DESCRIPTION,
        url: SITE_CONFIG.SITE_URL,
        siteName: SITE_CONFIG.SITE_NAME,
        images: [{
            url: SITE_CONFIG.SITE_OG_IMAGE,
            width: 1200,
            height: 630,
            alt: SITE_CONFIG.SITE_NAME,
        }],
        locale: 'ja_JP',
        type: WEBSITE as MetadataType,
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_CONFIG.SITE_NAME,
        description: SITE_CONFIG.SITE_DESCRIPTION,
        images: [SITE_CONFIG.SITE_TWITTER_IMAGE],
        // creator: SITE_CONFIG.SITE_TWITTER_HANDLE,
    },
    robots: {
        index: true,
        follow: true,
    }
}