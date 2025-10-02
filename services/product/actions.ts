import { getProductRepository, updateProductRepository } from "@/repository/product"
import { calculateReviewStats } from "@/services/review/calculation"
import { 
    PRODUCTS_DISPLAY_CONFIG, 
    TREND_PRODUCT_SALES_VOLUME_THRESHOLD,
    COLLECTION_SORT_TYPES,
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { TREND_LIMIT, OPTIMAL_SYNCS_LIMIT } = PRODUCTS_DISPLAY_CONFIG;
const { CREATED_DESCENDING } = COLLECTION_SORT_TYPES;
const { PRODUCT_ERROR } = ERROR_MESSAGES;

// 商品詳細ページ：slugで商品データを取得
export const getProductBySlug = async ({
    slug,
}: { slug: ProductSlug }) => {
    try {
        const repository = getProductRepository();
        const product = await repository.getProductBySlug({ slug });

        if (!product) {
            return {
                success: false,
                error: PRODUCT_ERROR.NOT_FOUND,
                data: null
            };
        }

        const reviewStats = calculateReviewStats(product?.reviews || []);

        const parseIds = (field: string | null): string[] => {
            if (!field) return [];
            return field
                .split('\n')
                .filter(line => line.trim() !== '')
                .flatMap(line => 
                    line.split(',')
                        .map(item => item.trim())
                        .filter(item => item !== '')
                );
        };

        const requiredIds = parseIds(product.optimal_syncs_required_id);
        const optionIds = parseIds(product.optimal_syncs_option_id);
        const recommendedIds = parseIds(product.optimal_syncs_recommended_id)
            .filter(id => id !== product.id);

        const maxCount = OPTIMAL_SYNCS_LIMIT;

        const uniqueIds = new Set();
        const collectUniqueIds = (ids: string[], maxRemaining: number) => {
            const unique = ids.filter(id => !uniqueIds.has(id)).slice(0, maxRemaining);
            unique.forEach(id => uniqueIds.add(id));
            return unique;
        };

        const requiredLimited = collectUniqueIds(requiredIds, maxCount);
        const optionLimited = collectUniqueIds(optionIds, maxCount - uniqueIds.size);
        const recommendedLimited = collectUniqueIds(recommendedIds, maxCount - uniqueIds.size);

        const totalCount = uniqueIds.size;

        return {
            success: true, 
            error: null, 
            data: {
                product,
                reviewStats,
                optimalSyncs: {
                    totalCount,
                    requiredIds: requiredLimited,
                    optionIds: optionLimited,
                    recommendedIds: recommendedLimited,
                }
            }
        }
    } catch (error) {
        console.error('Database : Error in getProductBySlug: ', error);

        return {
            success: false, 
            error: PRODUCT_ERROR.FETCH_FAILED,
            data: null
        }
    }
}

// トレンド商品一覧セクション：カテゴリー別のトレンド商品データを一括取得
export const getAllCategoriesProductsSalesVolume = async ({
    limit = TREND_LIMIT,
    threshold = TREND_PRODUCT_SALES_VOLUME_THRESHOLD
}: GetAllCategoriesProductsProps) => {
    try {
        const repository = getProductRepository();
        const results = await repository.getAllCategoriesProducts({
            limit,
            threshold
        });

        return {
            success: true, 
            error: null, 
            data: results
        }
    } catch (error) {
        console.error('Database : Error in getAllCategoriesProductsSalesVolume: ', error);

        return {
            success: false, 
            error: PRODUCT_ERROR.TREND_FETCH_FAILED,
            data: null
        }
    }
};

// 商品一覧ページ：ページネーション付きの商品データを取得
export const getPaginatedProducts = async ({ 
    page, 
    limit, 
    query,
    category,
    isTrend = false,
    filters,
    sortType = CREATED_DESCENDING
}: GetPaginatedProductsProps) => {
    try{
        const repository = getProductRepository();
        const result = await repository.getPaginatedProducts({
            page,
            limit,
            query,
            category,
            isTrend,
            filters,
            sortType
        });

        return {
            success: true, 
            error: null, 
            data: result
        }
    } catch (error) {
        console.error('Database : Error in getPaginatedProducts: ', error);

        return {
            success: false, 
            error: PRODUCT_ERROR.FETCH_FAILED,
            data: null
        }
    }
}

// 商品データの更新
export const updateProduct = async ({
    productId,
    data
}: UpdateProductProps) => {
    try {
        const repository = updateProductRepository();
        await repository.updateProduct({ productId, data });

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in updateProduct: ', error);

        return {
            success: false, 
            error: PRODUCT_ERROR.UPDATE_FAILED,
        }
    }
}

// 商品の在庫数と売り上げ数の更新
export const updateStockAndSoldCount = async ({
    productUpdates
}: UpdateStockAndSoldCountProps) => {
    try {
        const repository = updateProductRepository();
        await repository.updateStockAndSoldCount({ productUpdates });

        return {
            success: true, 
            error: null, 
        }
    } catch (error) {
        console.error('Database : Error in updateStockAndSoldCount: ', error);

        return {
            success: false, 
            error: PRODUCT_ERROR.UPDATE_STOCK_AND_SOLD_COUNT_FAILED,
        }
    }
}