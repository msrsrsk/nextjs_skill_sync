import { CATEGORY_TAGS } from "@/constants/index"

const { 
    ACTIVE_TAG, 
    EXPLORER_TAG, 
    CREATIVE_TAG, 
    WISDOM_TAG, 
    UNIQUE_TAG 
} = CATEGORY_TAGS;

export const isValidProductCategory = (
    query: string
): boolean => {
    const validCategories = [
        ACTIVE_TAG, 
        EXPLORER_TAG, 
        CREATIVE_TAG, 
        WISDOM_TAG, 
        UNIQUE_TAG 
    ]
    
    return validCategories.includes(query);
}