"use client"

import { Pencil } from "lucide-react"

import ReviewPostModal from "@/components/ui/review/ReviewPostModal"
import ReviewFormContent from "@/components/ui/review/ReviewFormContent"
import MessageModal from "@/components/common/modals/MessageModal"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import useAuth from "@/hooks/auth/useAuth"
import useReviewSubmissionForm from "@/hooks/form/useReviewSubmissionForm"
import useToastNotifications from "@/hooks/notification/useToastNotifications"
import { EventButtonPrimary } from "@/components/common/buttons/Button"
import { BUTTON_SIZES, BUTTON_TEXT_TYPES } from "@/constants/index"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;

interface ReviewFormPropsWithProductId extends ReviewFormProps {
    productId: ProductId;
}

const ReviewForm = ({ 
    productReviewsCount, 
    productReviewStats, 
    productId,
}: ReviewFormPropsWithProductId) => {
    const { isAuthenticated, loading } = useAuth();

    const { 
        errorMessage, 
        timestamp,
        handleSubmit, 
        postModalActive,
        setPostModalActive,
        showSuccessModal, 
        setShowSuccessModal,
    } = useReviewSubmissionForm();

    useToastNotifications({
        error: errorMessage,
        timestamp,
    });

    if (loading) return <LoadingSpinner />

    const hasReviews = productReviewsCount !== 0;

    return (
        <div className={`md:mx-20 mb-[36px] md:mb-[48px]${
            hasReviews ? ' mr-5' : ' mx-5'
        }`}>
            <div className={`flex flex-col items-center justify-center gap-6 max-w-[880px] mx-auto${
                hasReviews ? ' md-lg:flex-row md:gap-10 md-lg:gap-20' : ''
            }`}>
                {!hasReviews ? (
                    <p className="attention-text text-center">
                        まだレビューがありません。<br className="md:hidden" />
                        あなたの体験をシェアして、<br />
                        他のユーザーに共有しましょう！
                    </p>
                ) : (
                    <ReviewFormContent 
                        productReviewStats={productReviewStats}
                        productReviewsCount={productReviewsCount}
                    />
                )}

                {/* レビューを書くボタン */}
                <div>
                    <EventButtonPrimary
                        onClick={() => setPostModalActive(true)}
                        size={BUTTON_LARGE}
                        text={BUTTON_JA}
                        disabled={!isAuthenticated}
                    >
                        レビューを書く
                        <Pencil className="w-[18px] h-[18px] text-white" />
                    </EventButtonPrimary>

                    {!isAuthenticated && (
                        <p className="text-sm leading-[28px] font-medium text-center mt-2">
                            ※レビュー投稿はログインが必要です
                        </p>
                    )}
                </div>
            </div>

            {/* レビュー投稿モーダル */}
            <ReviewPostModal 
                modalActive={postModalActive} 
                setModalActive={setPostModalActive} 
                handleSubmit={handleSubmit}
                productId={productId}
            />

            {/* レビュー投稿結果モーダル */}
            <MessageModal
                modalActive={showSuccessModal}
                setModalActive={setShowSuccessModal}
                text={'レビューを送信しました。\nご投稿いただき\nありがとうございました。'}
                confetti={true}
            />
        </div>
    )
}

export default ReviewForm