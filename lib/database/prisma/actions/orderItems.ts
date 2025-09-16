import prisma from "@/lib/database/prisma/client"

import {
    PAGINATION_CONFIG,
    SUBSCRIPTION_STATUS,
    SUBSCRIPTION_HISTORY_CATEGORIES
} from "@/constants/index"

const { SUBS_ACTIVE, SUBS_CANCELLED } = SUBSCRIPTION_STATUS;
const {
    CATEGORY_SUBS_ACTIVE,
    CATEGORY_SUBS_ALL,
    CATEGORY_SUBS_CANCELLED
} = SUBSCRIPTION_HISTORY_CATEGORIES;
const { INITIAL_PAGE, PAGE_OFFSET } = PAGINATION_CONFIG;

interface CreateOrderItemsDataProps {
    orderItemsData: Array<{
        order_id: OrderId;
        product_id: ProductId;
        quantity: number;
        unit_price: number;
        total_price: number;
        stripe_price_id: string | null;
        created_at: Date;
        subscription_id: string | null;
        subscription_interval: string | null;
        remarks: string | null;
    }>;
}

// 注文商品リストの作成
export const createOrderItemsData = async ({
    orderItemsData
}: CreateOrderItemsDataProps) => {
    return await prisma.orderItem.createMany({
        data: orderItemsData
    });
};

// サブスクリプションの注文商品数の取得
export const getUserSubscriptionByProductData = async ({
    productId,
    userId
}: GetUserSubscriptionByProductProps) => {
    return await prisma.orderItem.count({
        where: {
            product_id: productId,
            subscription_id: {
                not: null
            },
            order: {
                user_id: userId
            }
        }
    });
};

// ユーザーのページネーション付きサブスク契約の取得
export const getUserPaginatedSubscriptionData = async ({
    userId,
    category,
    page,
    limit
}: GetUserPaginatedOrdersDataProps) => {
    const skip = (page - PAGE_OFFSET) * limit;

    const whereCondition: OrderItemWhereInput = {
        order: {
            user_id: userId
        },
        subscription_id: {
            not: null
        }
    };

    switch (category) {
        case CATEGORY_SUBS_CANCELLED:
            whereCondition.subscription_status = SUBS_CANCELLED;
            break;
        case CATEGORY_SUBS_ACTIVE:
            whereCondition.subscription_status = SUBS_ACTIVE;
            break;
        case CATEGORY_SUBS_ALL:
        default:
            break;
    }

    const [orderItems, totalCount] = await Promise.all([
        prisma.orderItem.findMany({
            where: whereCondition,
            include: {
                product: {
                    select: {
                        title: true,
                        image_urls: true,
                        price: true,
                        category: true,
                        slug: true,
                    }
                }
            },
            skip,
            take: limit,
            orderBy: {
                created_at: "desc"
            }
        }),
        prisma.orderItem.count({
            where: {
                order: {
                    user_id: userId
                },
                subscription_id: {
                    not: null
                },
                subscription_status: SUBS_ACTIVE as SubscriptionContractStatusType
            }
        })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return {
        data: {
            orderItems,
            totalCount,
            totalPages,
            currentPage: page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > INITIAL_PAGE
        }
    }
}

// 注文商品リストのサブスクリプションの次回支払日の取得
export const getOrderItemSubscriptionNextPaymentData = async ({
    subscriptionId
}: { subscriptionId: OrderItemSubscriptionId }) => {
    return await prisma.orderItem.findFirst({
        where: { subscription_id: subscriptionId },
        select: { subscription_next_payment: true }
    });
};

// 注文商品リストのサブスクリプションの契約状況の更新
export const updateOrderItemSubscriptionStatusData = async ({
    subscriptionId,
    subscriptionStatus
}: UpdateOrderItemSubscriptionStatusDataProps) => {
    return await prisma.orderItem.update({
        where: { subscription_id: subscriptionId },
        data: { subscription_status: subscriptionStatus }
    });
};