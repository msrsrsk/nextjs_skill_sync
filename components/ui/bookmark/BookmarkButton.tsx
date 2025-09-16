"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { useState } from "react"

import useAuth from "@/hooks/auth/useAuth"
import useBookmark from "@/hooks/bookmark/useBookmark"
import useBookmarkProduct from "@/hooks/bookmark/useBookmarkProduct"
import { SITE_MAP } from "@/constants/index"

const { LOGIN_PATH } = SITE_MAP;

const BookmarkButton = ({ 
    productId
}: { productId: ProductId }) => {
    const [showLoginMessage, setShowLoginMessage] = useState(false);

    const { 
        isAuthenticated, 
        loading: authLoading 
    } = useAuth();

    const { 
        loading: bookmarkProductLoading, 
        error: bookmarkProductError,
        isBookmarked, 
        setIsBookmarked,
    } = useBookmarkProduct({ productId });

    const { 
        loading: bookmarkToggleLoading,
        error: bookmarkToggleError,
        addBookmark,
        removeBookmark,
    } = useBookmark();

    if (bookmarkProductError || bookmarkToggleError) {
        return <p className="small-text whitespace-pre-line">
            {bookmarkProductError || bookmarkToggleError}
        </p>
    }

    const handleClick = () => {
        if (!authLoading && isAuthenticated) {
            setShowLoginMessage(false);

            if (isBookmarked) {
                removeBookmark({ productId });
                setIsBookmarked(false);
            } else {
                addBookmark({ productId });
                setIsBookmarked(true);
            }
        } else {
            setShowLoginMessage(true);
        }
    };

    const isDisabled = bookmarkProductLoading || bookmarkToggleLoading;

    return (
        <div className="flex items-center gap-3">
            <button 
                className="w-11 h-11 md:w-12 md:h-12 bg-white rounded-full grid place-items-center disabled:opacity-60"
                aria-label={isBookmarked ? "お気に入りを解除する" : "お気に入りに登録する"}
                onClick={handleClick}
                disabled={isDisabled}
            >
                <Heart 
                    className="w-6 h-6 text-tag-default" 
                    fill={isBookmarked ? "currentColor" : "none"}
                    strokeWidth={2.5} 
                />
            </button>

            {showLoginMessage && (
                <p className="text-sm leading-6 font-medium">
                    お気に入り登録は<br />
                    <Link href={LOGIN_PATH} className="underline">ログイン</Link>
                    が必要です
                </p>
            )}
        </div>
    )
}

export default BookmarkButton