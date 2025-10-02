import { 
    createUserBookmarkRepository, 
    deleteUserBookmarkRepository
} from "@/repository/bookmark"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { BOOKMARK_ERROR } = ERROR_MESSAGES;

interface BookmarkActionsProps extends UserIdProps {
    productId: ProductId;
}

export const addBookmark = async ({ 
    userId, 
    productId 
}: BookmarkActionsProps) => {
    try {
        const repository = createUserBookmarkRepository();
        await repository.createUserBookmark({ userId, productId });

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
        const repository = deleteUserBookmarkRepository();
        await repository.deleteUserBookmark({ userId, productId });

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

export const removeAllBookmarks = async ({ userId }: UserIdProps) => {
    try {
        const repository = deleteUserBookmarkRepository();
        await repository.deleteUserAllBookmarks({ userId });

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