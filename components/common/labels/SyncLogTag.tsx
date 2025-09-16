import { SYNC_LOG_CATEGORIES, SYNC_LOG_TAG_SIZES } from "@/constants/index"

const { 
    SYNC_UPDATES, 
    SYNC_VOICES, 
    SYNC_EXTRAS 
} = SYNC_LOG_CATEGORIES;
const { TAG_SMALL } = SYNC_LOG_TAG_SIZES;

interface SyncLogTagProps {
    categoryName: string;
    customClass?: string;
    size?: SyncLogTagSizeType;
}

const SyncLogTag = ({ 
    categoryName, 
    size = TAG_SMALL, 
    customClass 
}: SyncLogTagProps) => {
    const getAriaLabel = (categoryName: SyncLogTagProps['categoryName']) => {
        return `${categoryName} Category`;
    };

    return (
        <span 
            className={`log-tag${
                size === TAG_SMALL ? ' text-xs md:text-sm' : ' text-sm md:text-base'}${
                categoryName === SYNC_UPDATES ? ' text-tag-updates' : ''}${
                categoryName === SYNC_VOICES ? ' text-tag-voices' : ''}${
                categoryName === SYNC_EXTRAS ? ' text-tag-extras' : ''}${
                customClass ? ` ${customClass}` : ''
            }`}
            aria-label={getAriaLabel(categoryName)}
        >
            <span aria-hidden="true">(( {categoryName} ))</span>
        </span>
    )
}

export default SyncLogTag