import prisma from "@/lib/database/prisma/client"

interface BookmarkActionsProps extends UserIdActionsProps {
    productId: ProductId;
}

interface GetUserBookmarksDataProps extends UserIdActionsProps {
    limit: number;
}

// ユーザーのお気に入りの作成
export const createUserBookmarkData = async ({ 
    userId, 
    productId 
}: BookmarkActionsProps) => {
    return await prisma.userBookmark.create({
        data: {
            user_id: userId,
            product_id: productId
        }
    });
}

// ユーザーのお気に入りデータの取得
export const getUserBookmarksData = async ({ 
    userId,
    limit, 
}: GetUserBookmarksDataProps) => {
    const bookmarks = await prisma.userBookmark.findMany({
        take: limit,
        where: {
            user_id: userId
        },
        include: {
            product: {
                select: {
                    id: true,
                    title: true,
                    image_urls: true,
                    slug: true,
                    category: true,
                    price: true,
                }
            }
        },
        orderBy: {
            created_at: 'desc'
        }
    })

    return { bookmarks }
}

// ユーザーのお気に入り状態の取得
export const getUserProductBookmarksData = async ({ 
    userId,
    productId
}: BookmarkActionsProps) => {
    const bookmarks = await prisma.userBookmark.findFirst({
        where: {
            user_id: userId,
            product_id: productId
        }
    })

    const isBookmarked = bookmarks ? true : false;

    return { isBookmarked }
}

// ユーザーのお気に入りの削除
export const deleteUserBookmarkData = async ({
    userId,
    productId
}: BookmarkActionsProps) => {
    return await prisma.userBookmark.delete({
        where: {
            user_id_product_id: {
                user_id: userId,
                product_id: productId
            }
        }
    });
}

// ユーザーの全てのお気に入りの削除
export const deleteAllUserBookmarksData = async ({ 
    userId 
}: UserIdActionsProps) => {
    return await prisma.userBookmark.deleteMany({
        where: { user_id: userId }
    });
}