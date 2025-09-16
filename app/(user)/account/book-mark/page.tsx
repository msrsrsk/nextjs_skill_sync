"use client"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import BookmarkContent from "@/components/ui/bookmark/BookmarkContent"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import useBookmarkData from "@/hooks/bookmark/useBookmarkData"

const BookmarkPage = () => {
    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Book Mark" 
                customClass="mt-6 mb-3 md:mt-10 md:mb-4" 
            />

            <BookmarkWrapper />
        </div>
    </>
}

const BookmarkWrapper = () => {
    const { 
        bookmarkData, 
        setBookmarkData,
        loading: bookmarkLoading, 
        error: bookmarkError 
    } = useBookmarkData();

    if (bookmarkError) return <ErrorMessage message={bookmarkError as string} />
    if (bookmarkLoading || !bookmarkData) return <LoadingSpinner />

    return (
        <BookmarkContent 
            bookmarkData={bookmarkData} 
            setBookmarkData={setBookmarkData}
        />
    )
}

export default BookmarkPage