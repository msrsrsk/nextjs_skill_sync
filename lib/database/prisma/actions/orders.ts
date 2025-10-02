import prisma from "@/lib/database/prisma/client"

import { 
    ORDER_STATUS, 
    ORDER_HISTORY_CATEGORIES, 
    PAGINATION_CONFIG,
} from "@/constants/index"

const { ORDER_PROCESSING, ORDER_PENDING, ORDER_SHIPPED } = ORDER_STATUS;
const { CATEGORY_ALL, CATEGORY_NOT_SHIPPED, CATEGORY_SHIPPED } = ORDER_HISTORY_CATEGORIES;
const { INITIAL_PAGE, PAGE_OFFSET } = PAGINATION_CONFIG;

interface OrderActionsProps {
    orderId: OrderId;
}

interface GetOrderByIdDataProps extends OrderActionsProps {
    isSubscription?: boolean;
}

// 注文データの作成
export const createOrderData = async ({ 
    orderData 
}: { orderData: Order }) => {
    return await prisma.order.create({
        data: orderData as OrderCreateInput
    });
}

// ユーザーのページネーション付き注文履歴の取得
export const getUserPaginatedOrdersData = async ({
    userId,
    category,
    page,
    limit
}: GetUserPaginatedOrdersProps) => {
    const skip = (page - PAGE_OFFSET) * limit;

    const whereCondition: OrderWhereInput = {
        user_id: userId,
    };

    switch (category) {
        case CATEGORY_NOT_SHIPPED:
            whereCondition.status = ORDER_PROCESSING;
            break;
        case CATEGORY_SHIPPED:
            whereCondition.status = ORDER_SHIPPED;
            break;
        case CATEGORY_ALL:
        default:
            break;
    }

    const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
            where: whereCondition,
            include: {
                order_items: {
                    select: {
                        product_id: true,
                        quantity: true,
                        unit_price: true,
                        subscription_id: true,
                        remarks: true,
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
                    orderBy: {
                        created_at: "desc"
                    }
                },
            },
            skip,
            take: limit,
            orderBy: [
                { created_at: "desc" }
            ]
        }),
        prisma.order.count({
            where: {
                user_id: userId,
            }
        })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return {
        data: {
            orders,
            totalCount,
            totalPages,
            currentPage: page,
            hasNextPage: page < totalPages,
            hasPrevPage: page > INITIAL_PAGE
        }
    }
}

// 注文履歴の詳細データの取得
export const getOrderByIdData = async ({ 
    orderId,
    isSubscription = false
}: GetOrderByIdDataProps) => {
    return await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            order_items: {
                select: {
                    product_id: true,
                    quantity: true,
                    unit_price: true,
                    subscription_id: true,
                    subscription_status: true,
                    subscription_next_payment: true,
                    remarks: true,
                    product: {
                        select: {
                            title: true,
                            image_urls: true,
                            price: true,
                            category: true,
                            slug: true,
                        }
                    },
                    ...(isSubscription && {
                        subscriptionPayments: {
                            select: {
                                id: true,
                                payment_date: true,
                                status: true,
                            },
                            orderBy: {
                                payment_date: "asc"
                            }
                        }
                    })
                },
                orderBy: {
                    created_at: "desc"
                }
            },
        },
    });
}

// 注文履歴の商品情報（IDと数量）の取得
export const getOrderByIdWithOrderItemsData = async ({ 
    orderId 
}: OrderActionsProps) => {
    return await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            order_items: {
                select: {
                    product_id: true,
                    quantity: true,
                }
            }
        }
    });
}

// 未発送の注文数の取得
export const getUnshippedOrdersCountData = async ({ 
    userId 
}: { userId: UserId }) => {
    return await prisma.order.count({
        where: {
            user_id: userId,
            status: {
                in: [ORDER_PROCESSING, ORDER_PENDING] as OrderStatusType[]
            }
        }
    });
}

// 注文履歴の削除
export const deleteOrderData = async ({ 
    orderId 
}: OrderActionsProps) => {
    return await prisma.order.delete({
        where: { id: orderId }
    });
}