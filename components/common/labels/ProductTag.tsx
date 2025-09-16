import { Zap, Feather, Origami, GraduationCap, Puzzle } from "lucide-react"

import { CATEGORY_TAGS } from "@/constants/index"

const { 
    ALL_TAG,
    ACTIVE_TAG, 
    EXPLORER_TAG, 
    CREATIVE_TAG, 
    WISDOM_TAG, 
    UNIQUE_TAG,
} = CATEGORY_TAGS;

interface ProductTagProps {
    category: Exclude<ProductCategoryTagType, typeof ALL_TAG>;
}

const ProductTag = ({ category }: ProductTagProps) => {
    const getAriaLabel = (category: ProductTagProps['category']) => {
        return `${category} Skill`;
    };

    return (
        <div 
            className={`product-tag ${`is-${category.toLowerCase()}`}`}
            aria-label={getAriaLabel(category)}
        >
            {category === ACTIVE_TAG ? <Zap className="w-[15px] h-[17px]" /> : ''}
            {category === EXPLORER_TAG ? <Feather className="w-[15px] h-[15px]" /> : ''}
            {category === CREATIVE_TAG ? <Origami className="w-[15px] h-[15px]" /> : ''}
            {category === WISDOM_TAG ? <GraduationCap className="w-[17px] h-[13px]" /> : ''}
            {category === UNIQUE_TAG ? <Puzzle className="w-[15px] h-[15px]" /> : ''}
            <span aria-hidden="true">{category}</span>
        </div>
    )
}

export default ProductTag