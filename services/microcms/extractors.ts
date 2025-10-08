import { formatTitleCase } from "@/lib/utils/format"
import { 
    NOIMAGE_PRODUCT_IMAGE_URL, 
    CATEGORY_TAGS,
    SITE_MAP, 
} from "@/constants/index"

const { 
    ACTIVE_TAG, 
    EXPLORER_TAG, 
    CREATIVE_TAG, 
    WISDOM_TAG, 
    UNIQUE_TAG, 
    RANDOM_TAG 
} = CATEGORY_TAGS;
const { CATEGORY_PATH } = SITE_MAP;

export const extractSyncLogData = (productLink: string | null) => {
    const extractImageUrl = (url: string) => {
        return url ? url.split(`${CATEGORY_PATH}/`)[1] : NOIMAGE_PRODUCT_IMAGE_URL;
    };

    const extractCategoryName = (url: string): ExcludeProductCategoryTagType => {
        if (!url) return ACTIVE_TAG;
        
        const categoryPart = url.split(`${CATEGORY_PATH}/`)[1]?.split('/')[0];
        if (!categoryPart) return ACTIVE_TAG;
        
        const formattedCategory = formatTitleCase(categoryPart);
        
        const categoryMap = new Map([
            [ACTIVE_TAG, ACTIVE_TAG],
            [EXPLORER_TAG, EXPLORER_TAG],
            [CREATIVE_TAG, CREATIVE_TAG],
            [WISDOM_TAG, WISDOM_TAG],
            [UNIQUE_TAG, UNIQUE_TAG],
            [RANDOM_TAG, RANDOM_TAG]
        ])
        
        return categoryMap.get(formattedCategory as ExcludeProductCategoryTagType) || ACTIVE_TAG;
    }

    const extractProductName = (url: string) => {
        if (!url) return "No Product Name";
        
        return url
            .substring(url.lastIndexOf('/') + 1)
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    return {
        imageUrl: extractImageUrl(productLink || ''),
        categoryName: extractCategoryName(productLink || ''),
        productName: extractProductName(productLink || '')
    }
}