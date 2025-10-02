import { 
    CATEGORY_TAGS, 
    PRODUCT_PRICE_STATUS,
    OPTIMAL_SYNC_TAG_TYPES,
    COLLECTION_SORT_TYPES
} from "@/constants/index"

const { 
    ACTIVE_TAG, 
    EXPLORER_TAG, 
    CREATIVE_TAG, 
    WISDOM_TAG, 
    UNIQUE_TAG,
    RANDOM_TAG
} = CATEGORY_TAGS;
const { PRODUCT_SALE, PRODUCT_SOLDOUT } = PRODUCT_PRICE_STATUS;
const { REQUIRED_TAG, OPTION_TAG, PICKUP_TAG } = OPTIMAL_SYNC_TAG_TYPES;
const { 
    CREATED_DESCENDING, 
    BEST_SELLING, 
    TITLE_ASCENDING, 
    TITLE_DESCENDING, 
    PRICE_ASCENDING, 
    PRICE_DESCENDING 
} = COLLECTION_SORT_TYPES;

export const formatCategory = (category: Exclude<ProductCategoryTagType, 'ALL_TAG'>): string => {
    if (!category) return '';
    
    const categoryMap = {
        [ACTIVE_TAG]: "アクティブ",
        [EXPLORER_TAG]: "冒険",
        [CREATIVE_TAG]: "創作",
        [WISDOM_TAG]: "知恵",
        [UNIQUE_TAG]: "ユニーク",
        [RANDOM_TAG]: "ランダム",
    }
    
    return categoryMap[category] || category;
}

export const formatCollectionSortType = (sortType: CollectionSortType): string => {
    if (!sortType) return '';
    
    const sortTypeMap = {
        [CREATED_DESCENDING]: "新着順",
        [BEST_SELLING]: "ベストセラー",
        [TITLE_ASCENDING]: "タイトル順（A,Z）",
        [TITLE_DESCENDING]: "タイトル順（Z,A）",
        [PRICE_ASCENDING]: "価格の安い順",
        [PRICE_DESCENDING]: "価格の高い順",
    }

    return sortTypeMap[sortType] || sortType;
}

export const formatProductPriceStatus = (status: ProductPriceStatusType): string => {
    const statusMap = {
        [PRODUCT_SALE]: "セール中",
        [PRODUCT_SOLDOUT]: "売り切れ",
    }

    return statusMap[status] || status;
}

export const formatOptimalSyncsStatus = (status: OptimalSyncTagType): string => {
    const statusMap = {
        [PICKUP_TAG]: "おすすめ",
        [REQUIRED_TAG]: "必須",
        [OPTION_TAG]: "オプション",
    }

    return statusMap[status] || status;
}