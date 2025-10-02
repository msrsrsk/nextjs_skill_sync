import prisma from "@/lib/database/prisma/client"

interface BookmarkProps extends UserIdProps {
    productId: ProductId;
}

interface GetUserBookmarksProps extends UserIdProps {
    limit: number;
}

export const createUserBookmarkRepository = () => {
    return {
        // ユーザーのお気に入りの作成
        createUserBookmark: async ({ 
            userId, 
            productId 
        }: BookmarkProps) => {
            return await prisma.userBookmark.create({
                data: {
                    user_id: userId,
                    product_id: productId
                }
            })
        }
    }
}

export const getUserBookmarksRepository = () => {
    return {
        // ユーザーのお気に入りデータの取得
        getUserBookmarks: async ({ 
            userId, 
            limit 
        }: GetUserBookmarksProps) => {
            return await prisma.userBookmark.findMany({
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
        },
        // ユーザーのお気に入り状態の取得
        getUserProductBookmark: async ({ 
            userId, 
            productId 
        }: BookmarkProps) => {
            const bookmarks = await prisma.userBookmark.findFirst({
                where: { user_id: userId, product_id: productId }
            });
        
            return { isBookmarked: !!bookmarks };
        }
    }
}

export const deleteUserBookmarkRepository = () => {
    return {
        // ユーザーのお気に入りの削除
        deleteUserBookmark: async ({ 
            userId, 
            productId 
        }: BookmarkProps) => {
            return await prisma.userBookmark.delete({
                where: {
                    user_id_product_id: {
                        user_id: userId,
                        product_id: productId
                    }
                }
            })
        },
        // ユーザーの全てのお気に入りの削除
        deleteUserAllBookmarks: async ({ userId }: UserIdProps) => {
            return await prisma.userBookmark.deleteMany({
                where: { user_id: userId }
            })
        }
    }
}