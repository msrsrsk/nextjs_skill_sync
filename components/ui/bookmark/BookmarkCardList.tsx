"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import ProductTag from "@/components/common/labels/ProductTag"
import useBookmark from "@/hooks/bookmark/useBookmark"
import useToastNotifications from "@/hooks/notification/useToastNotifications"
import { showSuccessToast } from "@/components/common/display/Toasts"
import { formatNumber } from "@/lib/utils/format"
import { SITE_MAP, NOIMAGE_PRODUCT_IMAGE_URL } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CATEGORY_PATH } = SITE_MAP;
const { BOOKMARK_ERROR } = ERROR_MESSAGES;

interface BookmarkCardListProps {
    bookmarks: UserBookmark[];
    handleOptimisticRemove: (productId: ProductId) => void;
}

const BookmarkCardList = ({ 
    bookmarks, 
    handleOptimisticRemove,
}: BookmarkCardListProps) => {
    const [selectedItem, setSelectedItem] = useState<ProductId | null>(null);

    const { 
        loading, 
        error: toggleError,
        success: toggleSuccess,
        removeBookmark,
    } = useBookmark();

    const handleRemove = async (productId: ProductId) => {
        setSelectedItem(productId);
        if (selectedItem) removeBookmark({ productId: selectedItem });
    }

    useToastNotifications({
        error: toggleError,
        timestamp: Date.now()
    });

    useEffect(() => {
        if (toggleSuccess) {
            if (selectedItem) handleOptimisticRemove(selectedItem);
            showSuccessToast(BOOKMARK_ERROR.REMOVE_INDIVIDUAL_SUCCESS);
            setSelectedItem(null);
        }
    }, [toggleSuccess]);

    return (
        bookmarks.map((bookmark) => {
            const { product } = bookmark;
            const { 
                id: productId,
                title, 
                slug,
                image_urls, 
                category,
                price, 
            } = product;

            return (
                <div 
                    key={productId}
                    className="bg-soft-white rounded-sm pt-3 px-3 pb-5 md:px-6 flex flex-col justify-between"
                >
                    <Link href={
                        `${CATEGORY_PATH}/${category.toLowerCase()}/${slug}`
                    }>
                        {/* 商品画像 */}
                        <div className="flex justify-center mb-4">
                            <Image 
                                src={image_urls || NOIMAGE_PRODUCT_IMAGE_URL} 
                                alt=""
                                width={140}
                                height={140}
                                className="image-common drop-shadow-light max-w-[140px] min-w-[140px] md:w-full transform-gpu"
                            />
                        </div>

                        {/* 商品タグ */}
                        <div className="mb-2 md:mb-3">
                            <ProductTag category={category} />
                        </div>

                        {/* 商品タイトル */}
                        <p className="text-base md:text-lg leading-[24px] md:leading-[28px] font-bold font-poppins mb-1">
                            {title}
                        </p>

                        {/* 商品価格 */}
                        <div className="product-list-pricebox">
                            <p aria-label={`価格:${formatNumber(price)}円（税込）`}>
                                <span 
                                    className="product-list-symbol" 
                                    aria-hidden="true"
                                >
                                    ¥
                                </span>
                                <span 
                                    className="product-list-price" 
                                    aria-hidden="true"
                                >
                                    {formatNumber(price)}
                                </span>
                            </p>
                        </div>
                    </Link>

                    {/* 削除ボタン */}
                    <div className="flex justify-center mt-4 md:mt-6">
                        <button 
                            onClick={() => handleRemove(productId)}
                            type="button"
                            className="button-primary text-sm md:text-base min-w-[100px] min-h-[34px] md:min-w-[140px] md:min-h-[48px] disabled:opacity-40"
                            disabled={loading}
                        >
                            {loading ? '削除中...' : '削除する'}
                        </button>
                    </div>
                </div>
            )
        })
    )
}

export default BookmarkCardList