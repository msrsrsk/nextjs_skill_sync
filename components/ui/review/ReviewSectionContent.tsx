"use client"

import { useState } from "react"

import SectionTitle from "@/components/common/display/SectionTitle"
import NoDataText from "@/components/common/display/NoDataText"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import ReviewForm from "@/components/ui/review/ReviewForm"
import ReviewSlider from "@/components/ui/review/ReviewSlider"
import ReviewDetailModal from "@/components/ui/review/ReviewDetailModal"
import useSliderValidation from "@/hooks/validation/useSliderValidation"
import useIsProductPage from "@/hooks/layout/useIsProductPage"
import { reviewSliderSettings } from "@/lib/config/sliderOptions"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { REVIEW_DISPLAY_CONFIG, SITE_MAP } from "@/constants/index"

const { SECTION_LIMIT } = REVIEW_DISPLAY_CONFIG;
const { REVIEW_PATH } = SITE_MAP;

interface ReviewSectionProps extends ReviewStats {
    reviewData: ReviewResultProps;
    productId?: ProductId;
    hasError?: string | null;
}

const ReviewSectionContent = ({ 
    reviewData,
    productReviewStats,
    productId,
    hasError
}: ReviewSectionProps) => {
    const [detailModalActive, setDetailModalActive] = useState(false);
    const [selectedReviewIndex, setSelectedReviewIndex] = useState<number>(0);

    const { reviews, totalCount } = reviewData || { reviews: [], totalCount: 0 };

    const { 
        isSliderInitialized, 
        isSliderValid 
    }  = useSliderValidation(reviewSliderSettings, reviews.length);

    const { isProductPage } = useIsProductPage();

    const handleOpenModal = (index: number) => {
        setSelectedReviewIndex(index);
        setDetailModalActive(true);
    };

    return (
        <section className={`${
            reviews.length === 0 
                ? (isProductPage ? ' pt-10 md:pt-20' : ' c-container')
                : ' c-container-with-slider'
        }`}>
            <SectionTitle 
                title="Review" 
                customClass="mb-8 md:mb-10" 
            />

            {hasError ? (
                <ErrorMessage message={hasError} />
            ) : !isSliderInitialized || !reviewData ? (
                <LoadingSpinner />
            ) : <>
                {/* レビューの統計データ&投稿フォーム */}
                {isProductPage && productId && (
                    <ReviewForm 
                        productReviewsCount={reviews.length}
                        productReviewStats={productReviewStats}
                        productId={productId}
                    />
                )}

                {/* レビュー一覧 */}
                {reviews.length === 0 ? <>
                    {!isProductPage && (
                        <NoDataText />
                    )}
                </> : <>
                    <ReviewSlider
                        reviews={reviews}
                        isSliderValid={isSliderValid}
                        setModalActive={handleOpenModal}
                    />

                    {/* レビュー詳細モーダル */}
                    <ReviewDetailModal
                        review={reviews[selectedReviewIndex]}
                        modalActive={detailModalActive}
                        setModalActive={setDetailModalActive}
                    />
                </>}

                {/* レビュー一覧ページのリンクボタン */}
                {totalCount > SECTION_LIMIT && (
                    <LinkButtonPrimary
                        link={REVIEW_PATH}
                        customClass="button-space-default uppercase"
                        ariaLabel="レビュー一覧を見る"
                    >
                        <span aria-hidden="true">More</span>
                        <MoreIcon />
                    </LinkButtonPrimary>
                )}
            </>}
        </section>
    )
}

export default ReviewSectionContent