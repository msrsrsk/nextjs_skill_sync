import Image from "next/image"

import StarRating from "@/components/ui/review/StarRating"
import { formatNumber } from "@/lib/utils/format"
import { 
    STAR_RATING_SIZES_TYPES, 
    STAR_MAX_RATING, 
    REVIEW_FORM_CONFIG,
    SITE_MAP 
} from "@/constants/index"

const { STAR_LARGE } = STAR_RATING_SIZES_TYPES;
const { DECIMAL_PLACES, INITIAL_TOTAL, PERCENTAGE_MULTIPLIER } = REVIEW_FORM_CONFIG;
const { IMAGE_PATH } = SITE_MAP;

const ReviewFormContent = ({ productReviewStats, productReviewsCount }: ReviewFormProps) => {
    if (!productReviewStats) return null
    
    const { averageRating, ratingCounts } = productReviewStats;

    const ratingRange = Array.from(
        { length: STAR_MAX_RATING }, (_, i) => STAR_MAX_RATING - i
    );

    return <>
        {/* レビューの満足度 */}
        <div className="flex flex-col justify-center">
            <h3 className="text-lg md:text-xl leading-[28px] md:leading-[32px] font-medium mb-3 text-center">
                スキルの満足度
            </h3>
            <div className="flex items-center justify-center gap-4 mb-2">
                <StarRating 
                    rating={STAR_MAX_RATING} 
                    size={STAR_LARGE} 
                />
                <span className="text-[40px] leading-none font-semibold font-poppins">
                    {averageRating.toFixed(DECIMAL_PLACES)}
                </span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-[6px]">
                <span className="text-base font-semibold leading-none font-poppins translate-y-[1px]">
                    {formatNumber(productReviewsCount)}
                </span>
                <p className="text-base font-medium leading-none">
                    件のレビュー
                </p>
            </div>
        </div>

        {/* レビューの星の分布 */}
        {productReviewStats && (
            <div className="grid gap-2 justify-center">
                {ratingRange.map((rating: number) => {
                    const count = ratingCounts[rating as keyof typeof ratingCounts];
                    const total = Object.values(ratingCounts)
                        .reduce((sum, c) => sum + c, INITIAL_TOTAL);
                    const percentage = total > 0 ? (count / total) * PERCENTAGE_MULTIPLIER : 0;

                    return (
                        <div 
                            key={rating} 
                            className="flex items-center gap-4 w-full"
                        >
                            <div className="flex items-center gap-1">
                                <Image
                                    src={`${IMAGE_PATH}/star.png`}
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="w-4 h-4 align-bottom"
                                >
                                </Image>
                                <span 
                                    className="text-base font-semibold leading-none font-poppins min-w-3 text-center"
                                >
                                    {rating}
                                </span>
                            </div>
                            <div className="min-w-[200px] max-w-[200px] w-full relative overflow-hidden h-2 bg-form-line rounded-full">
                                <div 
                                    className="absolute top-0 left-0 h-full bg-foreground rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            <p 
                                className="text-base font-semibold leading-none font-poppins"
                            >
                                {formatNumber(count)}
                            </p>
                        </div>
                    )
                })}
            </div>
        )}
    </>
}

export default ReviewFormContent