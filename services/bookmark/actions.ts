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
        const result = await repository.createUserBookmark({ userId, productId });

        if (!result) {
            return {
                success: false, 
                error: BOOKMARK_ERROR.ADD_FAILED,
                data: null
            }
        }
    
        return {
            success: true,
            error: null,
            isBookmarked: !!result
        }
    } catch (error) {
        console.error('Database : Error in addBookmark: ', error);

        return {
            success: false, 
            error: BOOKMARK_ERROR.ADD_FAILED,
            data: null
        }
    }
}

export const getUserBookmark = async ({
    userId,
    productId
}: BookmarkActionsProps) => {
    const repository = getUserBookmarkRepository();
    const result = await repository.getUserProductBookmark({
        userId: userId as UserId,
        productId: productId
    });

    return { data: result }
}

export const getUserAllBookmarks = async ({ userId }: UserIdProps) => {
    const repository = getUserBookmarkRepository();
    const result = await repository.getUserBookmarks({
        userId: userId as UserId,
        limit: BOOKMARK_PAGE_DISPLAY_LIMIT
    });

    return { data: result }
}

export const removeBookmark = async ({
    userId,
    productId
}: BookmarkActionsProps) => {
    try {
        const repository = deleteUserBookmarkRepository();
        const result = await repository.deleteUserBookmark({ userId, productId });

        if (!result) {
            return {
                success: false, 
                error: BOOKMARK_ERROR.REMOVE_FAILED,
                data: null
            }
        }
    
        return {
            success: true,
            error: null,
            isBookmarked: !result
        }
    } catch (error) {
        console.error('Database : Error in removeBookmark: ', error);

        return {
            success: false, 
            error: BOOKMARK_ERROR.REMOVE_FAILED,
            data: null
        }
    }
}

export const removeAllBookmarks = async ({ userId }: UserIdProps) => {
    try {
        const repository = deleteUserBookmarkRepository();
        const result = await repository.deleteUserAllBookmarks({ userId });

        if (!result) {
            return {
                success: false, 
                error: BOOKMARK_ERROR.REMOVE_ALL_FAILED,
                data: null
            }
        }
    
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