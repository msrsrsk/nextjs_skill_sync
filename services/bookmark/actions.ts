import { 
    createUserBookmarkRepository, 
    getUserBookmarkRepository,
    deleteUserBookmarkRepository,
} from "@/repository/bookmark"
import { BOOKMARK_PAGE_DISPLAY_LIMIT } from "@/constants/index"

interface BookmarkActionsProps extends UserIdProps {
    productId: ProductId;
}

export const addBookmark = async ({ 
    userId, 
    productId 
}: BookmarkActionsProps) => {
    const repository = createUserBookmarkRepository();
    const result = await repository.createUserBookmark({ userId, productId });

    return {
        success: !!result,
        isBookmarked: !!result
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

    return {
        success: !!result,
        data: result
    }
}

export const getUserAllBookmarks = async ({ userId }: UserIdProps) => {
    const repository = getUserBookmarkRepository();
    const result = await repository.getUserBookmarks({
        userId: userId as UserId,
        limit: BOOKMARK_PAGE_DISPLAY_LIMIT
    });

    return { 
        success: !!result,
        data: result 
    }
}

export const removeBookmark = async ({
    userId,
    productId
}: BookmarkActionsProps) => {
    const repository = deleteUserBookmarkRepository();
    const result = await repository.deleteUserBookmark({ userId, productId });

    return {
        success: !!result,
        isBookmarked: !result
    }
}

export const removeAllBookmarks = async ({ userId }: UserIdProps) => {
    const repository = deleteUserBookmarkRepository();
    const result = await repository.deleteUserAllBookmarks({ userId });

    return { success: !!result }
}