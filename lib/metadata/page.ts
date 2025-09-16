import { Metadata } from "next"
import { SITE_CONFIG, DEFAULT_METADATA } from "@/constants/metadata"
import { METADATA_TYPES } from "@/constants/index"

const { SITE_URL, SITE_OG_IMAGE } = SITE_CONFIG;
const { WEBSITE } = METADATA_TYPES;

interface PageMetadata {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: MetadataType;
    robots?: {
        index: boolean;
        follow: boolean;
    };
}

export function generatePageMetadata({ 
    title, 
    description, 
    image, 
    url, 
    type = WEBSITE,
    robots
}: PageMetadata): Metadata {
    const pageUrl = url ? `${SITE_URL}${url}` : SITE_URL
    const pageImage = image || SITE_OG_IMAGE

    return {
        ...DEFAULT_METADATA,
        title: {
            default: `${title} | ${SITE_CONFIG.SITE_NAME}`,
            template: `%s | ${SITE_CONFIG.SITE_NAME}`,
        },
        description: description || DEFAULT_METADATA.description,
        openGraph: {
            ...DEFAULT_METADATA.openGraph,
            title,
            description: description || DEFAULT_METADATA.description,
            url: pageUrl,
            images: [
                {
                url: pageImage,
                width: 1200,
                height: 630,
                alt: title,
                },
            ],
            type,
        },
        twitter: {
            ...DEFAULT_METADATA.twitter,
            title,
            description: description || DEFAULT_METADATA.description,
            images: [pageImage],
        },
        robots: robots || DEFAULT_METADATA.robots,
    }
}