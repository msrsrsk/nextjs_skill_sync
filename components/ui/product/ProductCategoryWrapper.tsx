import { notFound } from "next/navigation"

import ErrorMessage from "@/components/common/display/ErrorMessage"
import ProductCategoryContent from "@/components/ui/product/ProductCategoryContent"
import { getPaginatedProducts } from "@/lib/services/product/actions"
import { getProductRepository } from "@/repository/product"
import { isValidCategory } from "@/lib/utils/validation"
import { PRODUCTS_DISPLAY_CONFIG, CATEGORY_TAGS } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PAGE_LIMIT } = PRODUCTS_DISPLAY_CONFIG;
const { ALL_TAG, RANDOM_TAG } = CATEGORY_TAGS;
const { PRODUCT_ERROR } = ERROR_MESSAGES;

interface ProductCategoryWrapperProps {
    page: number;
    category: string;
    categoryTitile: string;
    searchParams: {
        page?: string;
        minPrice?: string;
        maxPrice?: string;
        isStock?: string;
        sort?: CollectionSortType;
    };
    isTrend?: boolean;
}

const ProductCategoryWrapper = async ({
    page,
    category,
    categoryTitile,
    searchParams,
    isTrend
}: ProductCategoryWrapperProps) => {
    if (!isValidCategory(category, CATEGORY_TAGS)) notFound()

    const isAll = category === ALL_TAG.toLowerCase();
    const isRandom = category === RANDOM_TAG.toLowerCase();

    if (isRandom) notFound();

    const categoryType = isAll ? undefined : (categoryTitile as CategoryType);

    const productRepository = getProductRepository();
    const { data: priceBoundsData } = await productRepository.getProductPriceBounds();

    if (!priceBoundsData) {
        return <ErrorMessage message={PRODUCT_ERROR.PRICE_FETCH_FAILED} />
    }

    const priceBounds = priceBoundsData as ProductPriceBounds;

    const minPrice = parseInt(searchParams.minPrice || priceBounds.minPrice.toString());
    const maxPrice = parseInt(searchParams.maxPrice || priceBounds.maxPrice.toString());
    const isStock = searchParams.isStock === 'true';
    const sortType = searchParams.sort as CollectionSortType;

    const { 
        data: paginatedResultData, 
        error: paginatedResultError 
    } = await getPaginatedProducts({ 
        page, 
        limit: PAGE_LIMIT,
        category: categoryType,
        isTrend,
        filters: {
            priceRange: [minPrice, maxPrice],
            isStock
        },
        sortType
    });
    // const { data: paginatedResultData, error: paginatedResultError } = { data: undefined, error: undefined };

    if (paginatedResultError) return <ErrorMessage message={paginatedResultError} />
    if (!paginatedResultData) return <ErrorMessage message={PRODUCT_ERROR.FETCH_FAILED} />

    return <>
        <ProductCategoryContent 
            categoryData={paginatedResultData as ProductsCategoryData}
            category={categoryType || ALL_TAG}
            isTrend={isTrend}
        />
    </>
}

export default ProductCategoryWrapper