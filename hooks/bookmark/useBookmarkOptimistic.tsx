import { useCallback } from "react"

const useBookmarkOptimistic = ({
    bookmarkData,
    setBookmarkData
}: BookmarkContentProps) => {
    const handleOptimisticRemove = useCallback((productId: ProductId) => {
        const newData = bookmarkData.filter(bookmark => bookmark.product.id !== productId);
        setBookmarkData(newData);
    }, [bookmarkData, setBookmarkData]);

    const handleOptimisticRemoveAll = useCallback(() => {
        setBookmarkData([]);
    }, [setBookmarkData]);

    return {
        handleOptimisticRemove,
        handleOptimisticRemoveAll,
    }
}

export default useBookmarkOptimistic;