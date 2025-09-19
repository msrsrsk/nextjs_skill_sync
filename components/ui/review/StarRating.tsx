import { 
    StarColorFilledIcon, 
    StarColorEmptyIcon, 
    StarMonoFilledIcon, 
    StarMonoEmptyIcon 
} from "@/components/common/icons/SvgIcons"
import { 
    STAR_MAX_RATING, 
    STAR_RATING_SIZES_TYPES,
    STAR_RATING_TYPES
} from "@/constants/index"

const { STAR_SMALL, STAR_MEDIUM, STAR_LARGE } = STAR_RATING_SIZES_TYPES;
const { STAR_COLOR } = STAR_RATING_TYPES;

interface StarRatingProps {
    rating: number;
    size?: StarRatingSizeType;
    type?: StarRatingType;
}

const StarRating = ({
    rating,
    size = STAR_MEDIUM,
    type = STAR_COLOR
}: StarRatingProps) => {
    const roundedRating = Math.round(rating);

    const getSizeClass = (size: StarRatingSizeType) => {
        switch (size) {
            case STAR_SMALL:
                return 'w-[14px] h-[13px]';
            case STAR_MEDIUM:
                return 'w-[18px] h-[17px]';
            case STAR_LARGE:
                return 'w-[20px] h-[19px]';
            default:
                return 'w-[18px] h-[17px]';
        }
    };

    const sizeClass = getSizeClass(size);

    const getColorStarIcon = (isFilled: boolean) => {
        return isFilled ? 
            <StarColorFilledIcon customClass={sizeClass} /> : 
            <StarColorEmptyIcon customClass={sizeClass} />;
    }

    const getMonoStarIcon = (isFilled: boolean) => {
        return isFilled ? 
            <StarMonoFilledIcon customClass={sizeClass} /> : 
            <StarMonoEmptyIcon customClass={sizeClass} />;
    }

    return (
        <div 
            className="flex items-center gap-[2px]"
            role="img"
            aria-label={`評価：${STAR_MAX_RATING}星中${roundedRating}つ`}
        >
            {Array.from({ length: STAR_MAX_RATING }, (_, index) => {
                const starNumber = index + 1;
                const isFilled = starNumber <= roundedRating;
                
                return (
                    <div key={index} aria-hidden="true" >
                        {type === STAR_COLOR ? 
                            getColorStarIcon(isFilled) : getMonoStarIcon(isFilled)
                        }
                    </div>
                )
            })}
        </div>
    )
}

export default StarRating