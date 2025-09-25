"use client"

import Image from "next/image"
import Slider from "react-slick";
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CircleX } from "lucide-react"

import StarRating from "@/components/ui/review/StarRating"
import StatusBudge from "@/components/common/labels/StatusBudge"
import Overlay from "@/components/common/display/Overlay"
import useIsProductPage from "@/hooks/layout/useIsProductPage"
import usePageScrollReset from "@/hooks/layout/usePageScrollReset"
import usePreventScroll from "@/hooks/utils/usePreventScroll"
import { fadeScale } from "@/lib/motion"
import { reviewMainSliderSettings, reviewThumbsSliderSettings } from "@/lib/config/sliderOptions"
import { formatRelativeDate } from "@/lib/utils/format"
import { LinkButtonPrimary, EventButtonPrimary } from "@/components/common/buttons/Button"
import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { 
    BUTTON_SIZES, 
    BUTTON_TEXT_TYPES, 
    BUTTON_POSITIONS,
    STAR_RATING_TYPES,
    ANONYMOUS_USER_ICON_URL,
    SITE_MAP 
} from "@/constants/index"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { POSITION_LEFT } = BUTTON_POSITIONS;
const { STAR_COLOR } = STAR_RATING_TYPES;
const { CATEGORY_PATH } = SITE_MAP;

interface ReviewDetailModalProps extends ModalStateProps {
    review: ReviewWithUserAndProduct;
}

const ReviewDetailModal = ({ 
    review,
    modalActive, 
    setModalActive, 
}: ReviewDetailModalProps) => {
    const [mainSlider, setMainSlider] = useState<Slider | null>(null);
    const [thumbsSlider, setThumbsSlider] = useState<Slider | null>(null);

    const mainSliderRef = useRef<Slider | null>(null);
    const thumbsSliderRef = useRef<Slider | null>(null);

    const { isProductPage } = useIsProductPage();

    usePreventScroll(modalActive);
    
    const scrollTop = usePageScrollReset({
        condition: false
    });

    const handleClick = () => {
        setModalActive(false);
        scrollTop();
    }

    useEffect(() => {
        if (modalActive) {
            setMainSlider(mainSliderRef.current);
            setThumbsSlider(thumbsSliderRef.current);
        }
    }, [modalActive]);

    if (!review) return null
    
    const { 
        name, 
        created_at, 
        user, 
        rating, 
        comment, 
        is_priority, 
        image_urls, 
        product 
    } = review;

    const hasImages = image_urls?.length > 0;
    const hasMultipleImages = image_urls?.length > 1;

    const renderImage = (image: string, index: number, isThumbnail = false) => (
        <Image
            key={index}
            src={image}
            alt={`${index + 1}つ目の${isThumbnail ? 'サムネイル' : 'レビュー'}画像`} 
            width={isThumbnail ? 100 : 800}
            height={isThumbnail ? 100 : 800}
            className={isThumbnail 
                ? "rounded-[12px] md:rounded-[16px] p-[5px]"
                : "image-common rounded-[16px]"
            }
        />
    );

    return (
        <AnimatePresence mode="wait">
            {modalActive && (
                <div className="review-detail-modal">
                    <div className="modal-container">
                        <motion.div 
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            variants={fadeScale()}
                            className={`modal-inner rounded-sm pt-5 pl-5 pb-6 md:pt-10 pr-2 md:px-10 md:pb-11 md:max-h-[644px] flex flex-col${
                                hasImages ? ' max-w-[952px]' : ' max-w-md'
                            }`}
                        >
                            <div className="overflow-y-auto md:overflow-y-visible flex-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-sub [&::-webkit-scrollbar-thumb]:rounded-full">
                                <div className="md:flex md:justify-between md:items-center">
                                    {hasImages && (
                                        <div className="mb-5 md:mb-0 w-full md:w-[53%] pr-3 md:pr-0">
                                            {/* メインスライド */}
                                            <Slider 
                                                ref={mainSliderRef}
                                                asNavFor={thumbsSlider || undefined}
                                                {...reviewMainSliderSettings}
                                            >
                                                {image_urls.map((
                                                    image: string, 
                                                    index: number
                                                ) => (
                                                    renderImage(image, index)
                                                ))}
                                            </Slider>

                                            {/* サムネイルスライダー */}
                                            {hasMultipleImages && (
                                                <Slider
                                                    ref={thumbsSliderRef}
                                                    asNavFor={mainSlider || undefined}
                                                    {...reviewThumbsSliderSettings}
                                                    className="thumbs-slider mt-[7px] md:mt-[11px] ml-[-5px] mr-[-5px]"
                                                >
                                                    {image_urls.map((
                                                        image: string, 
                                                        index: number
                                                    ) => (
                                                        renderImage(image, index, true)
                                                    ))}
                                                </Slider>
                                            )}
                                        </div>
                                    )}

                                    {/* レビュー情報 */}
                                    <div className={`${
                                        hasImages ? 'md:w-[42%] mr-5 md:mr-0' : ''
                                    }`}>
                                        <div className="review-list-userbox">
                                            <Image 
                                                className="image-common max-w-[56px] max-h-[56px] md:max-w-[72px] md:max-h-[72px]" 
                                                src={user?.icon_url || ANONYMOUS_USER_ICON_URL} 
                                                alt={`${name}のアイコン画像`} 
                                                width={80} 
                                                height={80} 
                                            />
                                            <div>
                                                <p className="text-base md:text-xl leading-6 md:leading-8 font-bold">
                                                    {user ? name : '退会ユーザー'}
                                                </p>
                                                <p className="review-list-date">
                                                    {formatRelativeDate(created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="review-list-metabox">
                                            <StarRating 
                                                rating={rating} 
                                                type={STAR_COLOR}
                                            />
                                            {is_priority && 
                                                <StatusBudge status="Pickup" 
                                            />}
                                        </div>
                                        <p className="text-sm md:text-base leading-7 md:leading-8 font-medium">
                                            {comment}
                                        </p>

                                        {isProductPage ? (
                                            <EventButtonPrimary
                                                onClick={handleClick}
                                                size={BUTTON_LARGE}
                                                text={BUTTON_JA}
                                                position={POSITION_LEFT}
                                                customClass="mt-4"
                                            >
                                                商品を見る
                                                <MoreIcon />
                                            </EventButtonPrimary>
                                        ) : (
                                            <LinkButtonPrimary
                                                link={`${CATEGORY_PATH}/${product.category?.toLowerCase()}/${product.slug}`}
                                                size={BUTTON_LARGE}
                                                text={BUTTON_JA}
                                                position={POSITION_LEFT}
                                                customClass="mt-4"
                                            >
                                                商品を見る
                                                <MoreIcon />
                                            </LinkButtonPrimary>
                                        )}
                                    </div>

                                    <button 
                                        onClick={() => setModalActive(false)} 
                                        className="w-10 h-10 absolute top-1 right-1 md:top-4 md:right-4 bg-white rounded-sm grid place-items-center z-10"
                                        aria-label="モーダルを閉じる"
                                    >
                                        <CircleX 
                                            className="w-[22px] h-[22px] text-foreground" 
                                        />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    <Overlay 
                        isActive={modalActive} 
                        setActive={setModalActive}
                    />
                </div>
            )}
        </ AnimatePresence>
    )
}

export default ReviewDetailModal