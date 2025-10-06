import prisma from "@/lib/clients/prisma/client"
import { Prisma } from "@prisma/client"

import { isValidProductCategory } from "@/services/product/validation"
import { 
    PRODUCTS_DISPLAY_CONFIG, 
    TREND_PRODUCT_SALES_VOLUME_THRESHOLD,
    SECTION_CATEGORIES,
    GET_PRODUCTS_PAGE_TYPES,
    COLLECTION_SORT_TYPES,
    PAGINATION_CONFIG
} from "@/constants/index"

const { TREND_LIMIT } = PRODUCTS_DISPLAY_CONFIG;
const { 
    SYNC_CONDITIONS, 
    SKILL_TRAIL, 
    OPTIMAL_SYNCS, 
    CART,
} = GET_PRODUCTS_PAGE_TYPES;
const { 
    CREATED_DESCENDING,
    BEST_SELLING,
    TITLE_ASCENDING,
    TITLE_DESCENDING,
    PRICE_ASCENDING,
    PRICE_DESCENDING
} = COLLECTION_SORT_TYPES;
const { INITIAL_PAGE, PAGE_OFFSET } = PAGINATION_CONFIG;

interface GetProductsByIdsProps {
    ids: ProductId[];
    pageType: GetProductsPageType;
}

const defaultProductSelectFields = {
    id: true,
    title: true,
    description: true,
    price: true,
    image_urls: true,
    slug: true,
    category: true,
    stock: true,
    created_at: true,
    reviews: {
        select: {
            rating: true
        }
    },
    product_pricings: true
}

export const getProductRepository = () => {
    return {
        // 商品詳細ページ:商品データの取得
        getProductBySlug: async ({
            slug
        }: { slug: ProductSlug }) => {
            return await prisma.product.findUnique({
                where: { slug },
                include: {
                    reviews: {
                        where: {
                            is_approved: true
                        },
                        select: {
                            rating: true
                        }
                    },
                    product_pricings: true,
                    product_details: true,
                    product_stripes: true
                }
            })
        },
        getProductByProductId: async ({
            productId
        }: { productId: ProductId }) => {
            return await prisma.product.findUnique({
                where: { id: productId },
                select: {
                    title: true, 
                    price: true, 
                    product_pricings: {
                        select: {
                            sale_price: true
                        }
                    }
                }
            })
        },
        // 商品詳細ページ:メタデータ用の商品データ取得
        getProductBySlugForMetadata: async ({
            slug
        }: { slug: ProductSlug }) => {
            return await prisma.product.findUnique({
                where: { slug },
                select: {
                    title: true,
                    description: true,
                    category: true,
                }
            })
        },
        // 商品一覧セクション:複数の商品IDから個別商品データ取得
        getProductsByIds: async ({
            ids,
            pageType
        }: GetProductsByIdsProps) => {
            const getSelectFields = () => {
                if (pageType === SYNC_CONDITIONS) {
                    return {
                        id: true,
                        title: true,
                        image_urls: true,
                        category: true,
                        slug: true,
                    };
                }
        
                if (pageType === SKILL_TRAIL) {
                    return {
                        ...defaultProductSelectFields,
                    };
                }
        
                if (pageType === OPTIMAL_SYNCS) {
                    return {
                        title: true,
                        image_urls: true,
                        category: true,
                        slug: true,
                        optimal_syncs_text: true
                    };
                }
        
                if (pageType === CART) {
                    return {
                        id: true,
                        title: true,
                        image_urls: true,
                        price: true,
                        category: true,
                        slug: true,
                        stock: true,
                        product_pricings: {
                            select: {
                                sale_price: true
                            }
                        }
                    };
                }
            }
        
            return await prisma.product.findMany({
                where: { 
                    id: { in: ids } 
                },
                select: getSelectFields(),
            })
        },
        // 商品の価格範囲の取得（フィルタリング用）
        getProductPriceBounds: async () => {
            const products = await prisma.product.findMany({
                select: {
                    price: true,
                    product_pricings: {
                        select: {
                            sale_price: true
                        }
                    }
                }
            })
        
            const actualPrices = products.map(product => {
                return product.product_pricings?.sale_price || product.price;
            }).filter(price => price !== null);
        
            if (actualPrices.length === 0) {
                return {
                    success: true,
                    data: {
                        maxPrice: 0,
                        minPrice: 0
                    }
                };
            }
        
            const maxPrice = Math.max(...actualPrices);
            const minPrice = Math.min(...actualPrices);
        
            return {
                data: {
                    maxPrice,
                    minPrice
                }
            }
        },
        // トレンド商品一覧セクション:カテゴリー別のトレンド商品データを一括取得
        getAllCategoriesProducts: async ({
            limit = TREND_LIMIT,
            threshold = TREND_PRODUCT_SALES_VOLUME_THRESHOLD
        }: GetAllCategoriesProductsProps) => {
            const categories = Object.values(SECTION_CATEGORIES);
    
            const results = await Promise.all(
                categories.map(async (category) => {
                    const whereCondition = {
                        category: category as CategoryType,
                        product_pricings: {
                            sold_count: {
                                gte: threshold
                            }
                        }
                    };

                    const [products, totalCount] = await Promise.all([
                        prisma.product.findMany({
                            where: whereCondition,
                            select: defaultProductSelectFields,
                            take: limit,
                            orderBy: [
                                { product_pricings: { sold_count: "desc" } }
                            ]
                        }),
                        prisma.product.count({
                            where: whereCondition
                        })
                    ]);

                    return {
                        category,
                        products,
                        totalCount
                    };
                })
            )

            return results
        },
        // 商品一覧ページ:ページネーション付きの商品データ取得
        getPaginatedProducts: async ({
            page, 
            limit, 
            query,
            category,
            isTrend = false,
            filters,
            sortType = CREATED_DESCENDING
        }: GetPaginatedProductsProps) => {
            const skip = (page - PAGE_OFFSET) * limit;

            const whereCondition = {
                ...(category && { category }),
                ...(query && {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        ...(isValidProductCategory(query) ? [{ category: query as CategoryType }] : [])
                    ]
                }),
                ...(isTrend && {
                    product_pricings: {
                        sold_count: {
                            gte: TREND_PRODUCT_SALES_VOLUME_THRESHOLD
                        }
                    }
                }),
                ...(filters?.priceRange && {
                    OR: [
                        {
                            product_pricings: {
                                sale_price: { 
                                    not: null,
                                    gte: filters.priceRange[0], 
                                    lte: filters.priceRange[1] 
                                }
                            }
                        },
                        {
                            AND: [
                                {
                                    OR: [
                                        { product_pricings: { sale_price: null } },
                                        { product_pricings: null }
                                    ]
                                },
                                { price: { gte: filters.priceRange[0], lte: filters.priceRange[1] } }
                            ]
                        }
                    ]
                }),
                ...(filters?.isStock && {
                    stock: { gt: 0 }
                })
            }

            const getOrderBy = (): Prisma.ProductOrderByWithRelationInput[] => {
                switch (sortType) {
                    case CREATED_DESCENDING:
                        return [{ created_at: "desc" }];
                    case BEST_SELLING:
                        return [{ product_pricings: { sold_count: "desc" } }];
                    case TITLE_ASCENDING:
                        return [{ title: "asc" }];
                    case TITLE_DESCENDING:
                        return [{ title: "desc" }];
                    case PRICE_ASCENDING:
                        return [{ price: "asc" }];
                    case PRICE_DESCENDING:
                        return [{ price: "desc" }];
                    default:
                        return [{ created_at: "desc" }];
                }
            }

            const [products, totalCount] = await Promise.all([
                prisma.product.findMany({
                    where: whereCondition as ProductWhereInput,
                    select: defaultProductSelectFields,
                    skip,
                    take: limit,
                    orderBy: getOrderBy(),
                    distinct: ['id']
                }),
                prisma.product.count({
                    where: whereCondition as ProductWhereInput
                })
            ])

            const totalPages = Math.ceil(totalCount / limit)

            return {
                products,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > INITIAL_PAGE
            }
        }
    }
}

export const updateProductRepository = () => {
    return {
        // 商品の在庫数の更新
        updateProductStockWithTransaction: async ({
            productId,
            quantity,
            tx
        }: { 
            productId: 
            ProductId, 
            quantity: number,
            tx: TransactionClient
        }) => {
            return await tx.product.updateMany({
                where: { id: productId },
                data: {
                    stock: {
                        decrement: quantity
                    }
                }
            })
        }
    }
}