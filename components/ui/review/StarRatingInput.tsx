"use client"

import { useState } from "react"

import { StarColorFilledIcon, StarColorEmptyIcon } from "@/components/common/icons/SvgIcons"
import { STAR_MAX_RATING } from "@/constants/index"

interface StarRatingInputProps {
    rating: number;
    setRating: (rating: number) => void;
    onChange?: (rating: number) => void;
}

const StarRatingInput = ({
    rating,
    setRating,
    onChange
}: StarRatingInputProps) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (starNumber: number) => {
        setRating(starNumber);
        onChange?.(starNumber);
    }

    const handleMouseEnter = (starNumber: number) => {
        setHoverRating(starNumber);
    }

    const handleMouseLeave = () => {
        setHoverRating(0);
    }

    return (
        <div 
            className="flex items-center gap-2 justify-center pt-[1.5px] pb-[9.5px] md:pt-0 md:pb-2"
            role="radiogroup"
            aria-label="評価を選択してください"
        >
            {Array.from({ length: STAR_MAX_RATING }, (_, index) => {
                const starNumber = index + 1;
                const isFilled = starNumber <= (hoverRating || rating);
                
                return (
                    <button
                        key={index}
                        type="button"
                        className="p-1"
                        onClick={() => handleClick(starNumber)}
                        onMouseEnter={() => handleMouseEnter(starNumber)}
                        onMouseLeave={handleMouseLeave}
                        aria-label={`評価：${STAR_MAX_RATING}星中${rating}つ`}
                    >
                        {isFilled ? 
                            <StarColorFilledIcon 
                                customClass="star-rating-icon"
                            /> : 
                            <StarColorEmptyIcon 
                                customClass="star-rating-icon"
                            />
                        }
                    </button>
                )
            })}
        </div>
    )
}

export default StarRatingInput