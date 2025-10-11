import prisma from "@/lib/clients/prisma/client"

import {
    PAGINATION_CONFIG,
    SUBSCRIPTION_STATUS,
    SUBSCRIPTION_HISTORY_CATEGORIES
} from "@/constants/index"

const { SUBS_ACTIVE, SUBS_CANCELED } = SUBSCRIPTION_STATUS;
const {
    CATEGORY_SUBS_ACTIVE,
    CATEGORY_SUBS_CANCELED
} = SUBSCRIPTION_HISTORY_CATEGORIES;
const { INITIAL_PAGE, PAGE_OFFSET } = PAGINATION_CONFIG;

interface CreateOrderItemsProps {
    orderItemsData: Array<{
        order_id: OrderItemOrderId;
        product_id: OrderItemProductId;
        quantity: OrderItemQuantity;
        unit_price: OrderItemUnitPrice;
        total_price: OrderItemTotalPrice;
    }>;
}

export const createOrderItemRepository = () => {
    return {
        // 注文商品リストの作成
        createOrderItems: async ({
            orderItemsData
        }: CreateOrderItemsProps) => {
            const createdItems = await Promise.all(
                orderItemsData.map(itemData => 
                    prisma.orderItem.create({
                        data: itemData
                    })
                )
            )
            
            return createdItems;
        }
    }
}

export const getOrderItemRepository = () => {
    return {
        // サブスクリプションの注文商品数の取得
        getUserSubscriptionByProduct: async ({
            productId,
            userId
        }: GetUserSubscriptionByProductProps) => {
            return await prisma.orderItem.count({
                where: {
                    product_id: productId,
                    order_item_subscriptions: {
                        status: {
                            not: SUBS_CANCELED as SubscriptionStatusType
                        },
                    },
                    order: {
                        user_id: userId
                    }
                }
            })
        },
        // ユーザーのページネーション付きサブスク契約の取得
        getUserPaginatedSubscription: async ({
            userId,
            category,
            page,
            limit
        }: GetUserPaginatedOrdersProps) => {
            const skip = (page - PAGE_OFFSET) * limit;

            const whereCondition: OrderItemWhereInput = {
                order: {
                    user_id: userId
                },
                order_item_subscriptions: {
                    isNot: null
                }
            }

            const subscriptionCondition = whereCondition.order_item_subscriptions as {
                isNot: null;
                status?: SubscriptionStatusType;
            }
            
            switch (category) {
                case CATEGORY_SUBS_CANCELED:
                    subscriptionCondition.status = SUBS_CANCELED;
                    break;
                case CATEGORY_SUBS_ACTIVE:
                default:
                    subscriptionCondition.status = SUBS_ACTIVE;
                    break;
            }

            const [orderItems, totalCount] = await Promise.all([
                prisma.orderItem.findMany({
                    where: whereCondition,
                    include: {
                        order_item_subscriptions: {
                            select: {
                                subscription_id: true,
                                status: true,
                                next_payment_date: true,
                                remarks: true,
                            }
                        },
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
                        order_item_subscriptions: {
                            status: SUBS_ACTIVE
                        },
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
    }
}

export const deleteOrderItemRepository = () => {
    return {
        // 注文商品リストの削除
        deleteAllOrderItem: async ({
            orderId
        }: { orderId: OrderItemOrderId }) => {
            return await prisma.orderItem.deleteMany({
                where: { order_id: orderId }
            })
        }
    }
}