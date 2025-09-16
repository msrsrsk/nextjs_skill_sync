import { useCallback, useEffect, useState } from "react"

import useAuth from "@/hooks/auth/useAuth"
import { SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BOOKMARK_PRODUCT_API_PATH } = SITE_MAP;
const { BOOKMARK_ERROR } = ERROR_MESSAGES;

const useBookmarkProduct = ({ productId }: { productId: ProductId }) => {
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { isAuthenticated, loading: authLoading } = useAuth();

    useEffect(() => {
        if (productId && isAuthenticated && !authLoading) {
            getBookmarkProduct(productId);
        } else if (!isAuthenticated && !authLoading) {
            setIsBookmarked(false);
            setError(null);
        }
    }, [productId, isAuthenticated, authLoading]);

    const getBookmarkProduct = useCallback(async (productId: ProductId) => {
        if (loading || (!isAuthenticated && !authLoading)) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`
                ${BOOKMARK_PRODUCT_API_PATH}?productId=${productId}
            `, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (result.success) {
                setIsBookmarked(result.data.isBookmarked);
            } else {
                setIsBookmarked(false);
                setError(result.message);
            }
        } catch (error) {
            console.error(`Hook Error - Bookmark Product error:`, error);
            setIsBookmarked(false);
            setError(BOOKMARK_ERROR.FETCH_FAILED);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    return {
        loading,
        error,
        isBookmarked,
        setIsBookmarked,
        getBookmarkProduct,
    }
}

export default useBookmarkProduct