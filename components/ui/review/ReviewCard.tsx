import Image from "next/image"

import StarRating from "@/components/ui/review/StarRating"
import StatusBudge from "@/components/common/labels/StatusBudge"
import { formatRelativeDate } from "@/lib/utils/format"
import { REVIEW_IMAGE_CONFIG, ANONYMOUS_USER_ICON_URL } from "@/constants/index"

const { 
    MAX_DISPLAY, 
    OVERLAY_THRESHOLD, 
    OVERLAY_DISPLAY_COUNT 
} = REVIEW_IMAGE_CONFIG;

interface ReviewCardProps {
    review: ReviewWithUser;
    setModalActive: SetModalActive;
}

const ReviewCard = ({ review, setModalActive }: ReviewCardProps) => {
    const { 
        name, 
        created_at, 
        user, 
        rating, 
        comment, 
        is_priority, 
        image_urls 
    } = review;

    const overlayCount = image_urls.length - OVERLAY_DISPLAY_COUNT;
    const displayImages = image_urls.slice(
        0, 
        image_urls.length <= MAX_DISPLAY ? MAX_DISPLAY : OVERLAY_DISPLAY_COUNT
    );

    return (
        <div className="review-list-card h-full">
            {/* ユーザー情報 */}
            <div className="review-list-userbox">
                <Image 
                    className="review-list-avatar" 
                    src={user?.user_profiles?.icon_url || ANONYMOUS_USER_ICON_URL} 
                    alt={`${name}のアイコン画像`} 
                    width={80} 
                    height={80} 
                />
                <div>
                    <p className="review-list-name">{user ? name : '退会ユーザー'}</p>
                    <p className="review-list-date">
                        {formatRelativeDate(created_at)}
                    </p>
                </div>
            </div>

            {/* レビュー評価 */}
            <div className="review-list-metabox">
                <StarRating rating={rating} />
                {is_priority && <StatusBudge status="Pickup" />}
            </div>

            {/* レビューコメント */}
            <p className="small-text line-clamp-4">{comment}</p>

            {/* レビュー画像 */}
            <button 
                className="readmore-button"
                onClick={() => setModalActive(true)}
                aria-label="詳細を見る"
            >
                <span aria-hidden="true">Read more</span>
            </button>
            <button 
                className="review-list-imagebox"
                onClick={() => setModalActive(true)}
                aria-label="レビュー画像の詳細を見る"
            >
                {displayImages.map((image: string, index: number) => (
                    <div key={index}>
                        <Image 
                            className="review-list-image" 
                            src={image} 
                            alt={`${index + 1}つ目のレビュー画像`} 
                            width={100} 
                            height={100} 
                        />
                    </div>
                ))}

                {image_urls.length > OVERLAY_THRESHOLD && (
                    <div className="review-list-overlay">
                        <Image 
                            className="review-list-image" 
                            src={image_urls[2]} 
                            alt="" 
                            width={100} 
                            height={100} 
                        />
                        <span 
                            className="review-list-imagecount"
                            aria-label={`他${overlayCount}枚のレビュー画像があります`}
                        >
                            +{overlayCount}
                        </span>
                    </div>
                )}
            </button>
        </div>
    )
}

export default ReviewCard