import Slider from "react-slick"

import ReviewCard from "@/components/ui/review/ReviewCard"
import { reviewSliderSettings } from "@/lib/config/sliderOptions"

interface ReviewSliderProps {
    reviews: ReviewWithUser[];
    isSliderValid: boolean;
    setModalActive: (index: number) => void;
}

const ReviewSlider = ({ 
    reviews, 
    isSliderValid, 
    setModalActive, 
}: ReviewSliderProps) => {
    return (
        <div className={`w-full${
            !isSliderValid ? ' px-5 md:px-20' : ' slider-review-container lg:pl-0'
        }`}>
            {!isSliderValid ? (
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-[33px]">
                        {reviews.map((review, index) => (
                            <div key={review.id}>
                                <ReviewCard 
                                    setModalActive={() => setModalActive(index)}
                                    review={review}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <Slider {...reviewSliderSettings}>
                    {reviews.map((review, index) => (
                        <div key={review.id}>
                            <ReviewCard 
                                setModalActive={() => setModalActive(index)}
                                review={review}
                            />
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    )
}

export default ReviewSlider