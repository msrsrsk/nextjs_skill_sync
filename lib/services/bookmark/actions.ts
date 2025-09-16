import { 
    createUserBookmarkData, 
    deleteUserBookmarkData,
    deleteAllUserBookmarksData
} from "@/lib/database/prisma/actions/bookmarks"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BOOKMARK_ERROR } = ERROR_MESSAGES;

interface BookmarkActionsProps extends UserIdActionsProps {
    productId: ProductId;
}

export const addBookmark = async ({ 
    userId, 
    productId 
}: BookmarkActionsProps) => {
    try {
        await createUserBookmarkData({ userId, productId });

        return {
            success: true, 
            error: null, 
            isBookmarked: true
        }
    } catch (error) {
        console.error('Database : Error in addBookmark: ', error);

        return {
            success: false, 
            error: BOOKMARK_ERROR.ADD_FAILED
        }
    }
}

export const removeBookmark = async ({
    userId,
    productId
}: BookmarkActionsProps) => {
    try {
        await deleteUserBookmarkData({ userId, productId });

        return {
            success: true, 
            error: null, 
            isBookmarked: false
        }
    } catch (error) {
        console.error('Database : Error in removeBookmark: ', error);

        return {
            success: false, 
            error: BOOKMARK_ERROR.REMOVE_FAILED
        }
    }
}

export const removeAllBookmarks = async ({ userId }: UserIdActionsProps) => {
    try {
        await deleteAllUserBookmarksData({ userId });

        return {
            success: true, 
            error: null
        }
    } catch (error) {
        console.error('Database : Error in removeAllBookmarks: ', error);

        return {
            success: false, 
            error: BOOKMARK_ERROR.REMOVE_ALL_FAILED
        }
    }
}