"use client"

import BookmarkCardList from "@/components/ui/bookmark/BookmarkCardList"
import BookmarkRemoveAllButton from "@/components/ui/bookmark/BookmarkRemoveAllButton"
import NoDataText from "@/components/common/display/NoDataText"
import useBookmarkOptimistic from "@/hooks/bookmark/useBookmarkOptimistic"

const BookmarkContent = ({ 
    bookmarkData,
    setBookmarkData
}: BookmarkContentProps) => {

    const {
        handleOptimisticRemove,
        handleOptimisticRemoveAll,
    } = useBookmarkOptimistic({ 
        bookmarkData, 
        setBookmarkData
    });

    return <>
        <div className="max-w-3xl mx-auto mt-10 md:mt-3">
            {bookmarkData.length > 0 && (
                <BookmarkRemoveAllButton 
                    handleOptimisticRemoveAll={handleOptimisticRemoveAll}
                />
            )}

            {bookmarkData.length === 0 ? (
                <NoDataText />
            ) : (
                <div className="grid grid-cols-2 md-lg:grid-cols-3 lg-xl:grid-cols-4 gap-x-[10px] gap-y-4 md:gap-x-6 md:gap-y-8">
                    <BookmarkCardList 
                        bookmarks={bookmarkData}
                        handleOptimisticRemove={handleOptimisticRemove}
                    />
                </div>
            )}
        </div>
    </>
}

export default BookmarkContent