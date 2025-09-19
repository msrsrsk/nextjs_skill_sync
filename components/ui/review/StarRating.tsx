import { 
    StarColorFilledIcon, 
    StarColorEmptyIcon, 
    StarMonoFilledIcon, 
    StarMonoEmptyIcon 
} from "@/components/common/icons/SvgIcons"
import { 
    STAR_MAX_RATING, 
    STAR_RATING_SIZES_TYPES,
    STAR_RATING_SIZES,
    STAR_RATING_TYPES
} from "@/constants/index"

const { STAR_MEDIUM } = STAR_RATING_SIZES_TYPES;
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
    const { width, height } = STAR_RATING_SIZES[size];
    const sizeClass = `w-[${width}px] h-[${height}px]`;

    const getStarIcon = (isFilled: boolean) => {
        if (type === STAR_COLOR) {
            return isFilled ? 
                <StarColorFilledIcon customClass={sizeClass} /> : 
                <StarColorEmptyIcon customClass={sizeClass} />;
        } else {
            return isFilled ? 
                <StarMonoFilledIcon customClass={sizeClass} /> : 
                <StarMonoEmptyIcon customClass={sizeClass} />;
        }
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
                        {getStarIcon(isFilled)}
                    </div>
                )
            })}
        </div>
    )
}

export default StarRating