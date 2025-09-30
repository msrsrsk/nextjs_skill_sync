import { useCallback, useState } from "react"

import { BOOKMARK_OPERATION_TYPES, SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BOOKMARK_POST, BOOKMARK_DELETE } = BOOKMARK_OPERATION_TYPES;
const { BOOKMARK_API_PATH } = SITE_MAP;
const { BOOKMARK_ERROR } = ERROR_MESSAGES;

interface BookmarkOperationProps {
    productId: ProductId;
}

const useBookmark = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const bookmarkOperation = useCallback(async (
        method: BookmarkOperationType,
        { productId }: BookmarkOperationProps
    ) => {
        if (loading || !productId) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(BOOKMARK_API_PATH, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error(`Hook Error - Cart ${method} error:`, error);
            setError(
                method === BOOKMARK_POST 
                    ? BOOKMARK_ERROR.ADD_FAILED 
                    : BOOKMARK_ERROR.REMOVE_FAILED
            );
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const clearBookmarks = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${BOOKMARK_API_PATH}?action=all`, {
                method: BOOKMARK_DELETE,
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error(`Hook Error - Bookmark Clear error:`, error);
            setError(BOOKMARK_ERROR.REMOVE_ALL_FAILED);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    const addBookmark = useCallback(async ({ productId }: BookmarkOperationProps) => {
        await bookmarkOperation(BOOKMARK_POST, { productId });
    }, [bookmarkOperation]);

    const removeBookmark = useCallback(async ({ productId }: BookmarkOperationProps) => {
        await bookmarkOperation(BOOKMARK_DELETE, { productId });
    }, [bookmarkOperation]);

    return {
        loading,
        error,
        success,
        addBookmark,
        removeBookmark,
        clearBookmarks,
    }
}

export default useBookmark