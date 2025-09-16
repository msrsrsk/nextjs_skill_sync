"use client"

import { useState } from "react"

import ReviewCard from "@/components/ui/review/ReviewCard"
import ReviewDetailModal from "@/components/ui/review/ReviewDetailModal"

const ReviewListWrapper = ({ 
    reviews 
}: { reviews: ReviewWithUserAndProduct[] }) => {
    const [modalActive, setModalActive] = useState(false);
    const [selectedReviewIndex, setSelectedReviewIndex] = useState<number>(0);

    const handleOpenModal = (index: number) => {
        setSelectedReviewIndex(index);
        setModalActive(true);
    };

    return (
        <>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-x-[42px] xl:gap-y-[59px]">
                {reviews.map((review: ReviewWithUser, index: number) => (
                    <ReviewCard 
                        key={review.id}
                        setModalActive={() => handleOpenModal(index)}
                        review={review}
                    />
                ))}
            </div>

            <ReviewDetailModal
                modalActive={modalActive}
                setModalActive={setModalActive}
                review={reviews[selectedReviewIndex]}
            />
        </>
    )
}

export default ReviewListWrapper