import { useCallback, useEffect, useState } from "react"

import { SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BOOKMARK_API_PATH } = SITE_MAP;
const { BOOKMARK_ERROR } = ERROR_MESSAGES;

const useBookmarkData = () => {
    const [bookmarkData, setBookmarkData] = useState<BookmarkItemWithProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getBookmarkData();
    }, []);

    const getBookmarkData = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(BOOKMARK_API_PATH, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (result.success) {
                setBookmarkData(result.data.bookmarks);
            } else {
                setBookmarkData([]);
                setError(result.message);
            }
        } catch (error) {
            console.error(`Hook Error - Bookmark Data error:`, error);
            setBookmarkData([]);
            setError(BOOKMARK_ERROR.FETCH_FAILED);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    return {
        bookmarkData,
        setBookmarkData,
        loading,
        error,
    }
}

export default useBookmarkData