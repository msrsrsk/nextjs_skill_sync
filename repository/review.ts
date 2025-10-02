import prisma from "@/lib/database/prisma/client"

import { REVIEW_DISPLAY_CONFIG, PAGINATION_CONFIG } from "@/constants/index"

const { SECTION_LIMIT } = REVIEW_DISPLAY_CONFIG;
const { INITIAL_PAGE, PAGE_OFFSET } = PAGINATION_CONFIG;

interface GetPaginatedReviewsProps {
    page: number;
    limit: number;
    query?: string;
    userId?: UserId;
}

const defaultReviewIncludeFields = {
    user: {
        select: {
            icon_url: true
        }
    },
    product: {
        select: {
            slug: true,
        }
    }
}

export const createReviewRepository = () => {
    return {
        // レビューの作成
        createReview: async ({ reviewData }: { reviewData: Review }) => {
            return await prisma.review.create({
                data: reviewData
            })
        }
    }
}

export const getReviewRepository = () => {
    return {
        // 全てのレビューデータの取得
        getAllReviews: async () => {
            // ユーザーデータがあるレビュー
            const reviewsWithUser = await prisma.review.findMany({
                where: {
                    is_approved: true,
                    user_id: { not: null }
                },
                include: {
                    user: {
                        select: {
                            icon_url: true
                        }
                    },
                    product: {
                        select: {
                            slug: true,
                            category: true
                        }
                    }
                },
                orderBy: [
                    { is_priority: "desc" },
                    { created_at: "desc" }
                ]
            })

            // ユーザーデータがないレビュー
            const reviewsWithoutUser = await prisma.review.findMany({
                where: {
                    is_approved: true,
                    user_id: null
                },
                include: {
                    product: {
                        select: {
                            slug: true,
                            category: true
                        }
                    }
                },
                orderBy: [
                    { is_priority: "desc" },
                    { created_at: "desc" }
                ]
            })

            const allReviews = [
                ...reviewsWithUser,
                ...reviewsWithoutUser
            ]

            const sortedReviews = allReviews.sort((a, b) => {
                if (a.is_priority !== b.is_priority) {
                    return b.is_priority ? 1 : -1;
                }
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            })

            const limitedReviews = sortedReviews.slice(0, SECTION_LIMIT);

            const totalCount = await prisma.review.count({
                where: {
                    is_approved: true
                }
            })

            return {
                reviews: limitedReviews,
                totalCount
            }
        },
        // 個別商品のレビューの取得
        getProductReviews: async ({ 
            productSlug 
        }: { productSlug: ProductSlug }) => {
            const [reviews, totalCount] = await Promise.all([
                prisma.review.findMany({
                    where: {
                        is_approved: true,
                        product: {
                            slug: productSlug
                        }
                    },
                    include: defaultReviewIncludeFields,
                    take: SECTION_LIMIT, 
                    orderBy: [
                        { is_priority: "desc" },
                        { created_at: "desc" }
                    ]
                }),
                prisma.review.count({
                    where: {
                        is_approved: true
                    }
                })
            ])
        
            return {
                reviews,
                totalCount
            }
        },
        // ページネーション付きレビューデータの取得
        getPaginatedReviews: async ({ 
            page, 
            limit, 
            query, 
            userId 
        }: GetPaginatedReviewsProps) => {
            const skip = (page - PAGE_OFFSET) * limit;

            const whereCondition = {
                is_approved: true,
                ...(userId && { user_id: userId }),
                ...(query && {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { comment: { contains: query, mode: 'insensitive' } },
                        { product: { title: { contains: query, mode: 'insensitive' } } }
                    ]
                })
            }

            const [reviews, totalCount] = await Promise.all([
                prisma.review.findMany({
                    where: whereCondition as ReviewWhereInput,
                    include: defaultReviewIncludeFields,
                    skip,
                    take: limit,
                    orderBy: [
                        { is_priority: "desc" },
                        { created_at: "desc" }
                    ]
                }),
                prisma.review.count({
                    where: whereCondition as ReviewWhereInput
                })
            ])

            const totalPages = Math.ceil(totalCount / limit)

            return {
                data: {
                    reviews,
                    totalPages,
                    currentPage: page,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > INITIAL_PAGE
                }
            }
        }
    }
}