import { 
    createUserBookmarkRepository, 
    getUserBookmarkRepository,
    deleteUserBookmarkRepository,
} from "@/repository/bookmark"
import { BOOKMARK_PAGE_DISPLAY_LIMIT } from "@/constants/index"
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
        const isBookmarked = await repository.createUserBookmark({ userId, productId });

        if (!isBookmarked) {
            return {
                success: false,
                error: BOOKMARK_ERROR.ADD_FAILED,
                status: 500
            }
        }

        return { 
            success: true, 
            error: null, 
            isBookmarked: true
        }
    } catch (error) {
        console.error('Database : Error in addBookmark: ', error);

        return {
            success: false, 
            error: BOOKMARK_ERROR.ADD_FAILED,
            status: 500
        }
    }
}

export const getUserBookmark = async ({
    userId,
    productId
}: BookmarkActionsProps) => {
    try {
        const repository = getUserBookmarkRepository();
        const isBookmarked = await repository.getUserProductBookmark({
            userId: userId as UserId,
            productId: productId
        });

        if (!isBookmarked) {
            return {
                success: false,
                error: BOOKMARK_ERROR.FETCH_PRODUCT_FAILED,
                status: 404
            }
        }

        return {
            success: true, 
            error: null, 
            data: isBookmarked 
        }
    } catch (error) {
        console.error('Database Error - Error in getUserBookmark:', error);
        return {
            success: false,
            error: BOOKMARK_ERROR.FETCH_FAILED,
            status: 500
        }
    }
}

export const getUserAllBookmarks = async ({ userId }: UserIdProps) => {
    try {
        const repository = getUserBookmarkRepository();
        const bookmarkResult = await repository.getUserBookmarks({
            userId: userId as UserId,
            limit: BOOKMARK_PAGE_DISPLAY_LIMIT
        });

        if (!bookmarkResult) {
            return {
                success: false,
                error: BOOKMARK_ERROR.FETCH_FAILED,
                status: 404
            }
        }

        return { 
            success: true, 
            error: null, 
            data: bookmarkResult 
        }
    } catch (error) {
        console.error('Database Error - Error in getUserBookmarkList:', error);
        return {
            success: false,
            error: BOOKMARK_ERROR.FETCH_FAILED,
            status: 500
        }
    }
}

export const removeBookmark = async ({
    userId,
    productId
}: BookmarkActionsProps) => {
    try {
        const repository = deleteUserBookmarkRepository();
        const isBookmarked = await repository.deleteUserBookmark({ userId, productId });

        if (!isBookmarked) {
            return {
                success: false, 
                error: BOOKMARK_ERROR.REMOVE_FAILED,
                status: 500
            }
        }

        return {
            success: true, 
            error: null, 
            data: isBookmarked
        }
    } catch (error) {
        console.error('Database : Error in removeBookmark: ', error);

        return {
            success: false, 
            error: BOOKMARK_ERROR.REMOVE_FAILED,
            status: 500
        }
    }
}

export const removeAllBookmarks = async ({ userId }: UserIdProps) => {
    try {
        const repository = deleteUserBookmarkRepository();
        const bookmarkResult = await repository.deleteUserAllBookmarks({ userId });

        if (!bookmarkResult) {
            return {
                success: false, 
                error: BOOKMARK_ERROR.REMOVE_ALL_FAILED,
                status: 500
            }
        }

        return {
            success: true, 
            error: null,
            data: bookmarkResult
        }
    } catch (error) {
        console.error('Database : Error in removeAllBookmarks: ', error);

        return {
            success: false, 
            error: BOOKMARK_ERROR.REMOVE_ALL_FAILED,
            status: 500
        }
    }
}