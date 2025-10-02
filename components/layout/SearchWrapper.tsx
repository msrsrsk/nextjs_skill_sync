import ProductList from "@/components/ui/product/ProductList"
import Pagination from "@/components/ui/navigation/Pagination"
import SearchForm from "@/components/common/forms/SearchForm"
import PageCountText from "@/components/common/display/PageCountText"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import NoDataText from "@/components/common/display/NoDataText"
import { getPaginatedProducts } from "@/services/product/actions"
import { SEARCH_PAGE_DISPLAY_LIMIT, PAGINATION_CONFIG } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { INITIAL_PAGE } = PAGINATION_CONFIG;
const { PRODUCT_ERROR } = ERROR_MESSAGES;

interface SearchWrapperProps {
    page: number;
    query?: string;
}

const SearchWrapper = async ({ 
    page, 
    query = '', 
}: SearchWrapperProps) => {
    const limit = SEARCH_PAGE_DISPLAY_LIMIT;

    const { data, error } = await getPaginatedProducts({ page, limit, query });
    // const { data, error } = { data: undefined, error: undefined };

    if (error) return <ErrorMessage message={error} />
    if (!data) return <ErrorMessage message={PRODUCT_ERROR.FETCH_FAILED} />

    const { 
        products, 
        totalPages, 
        currentPage, 
        hasNextPage, 
        hasPrevPage 
    } = data;

    const isNoProducts = products.length === 0 || !query;

    return <>
        {query && (
            <PageCountText countText={`「${query}」の検索結果`} customClass="mb-3 md:mb-4">
                <span className="page-numtext-num">
                    {products.length}
                </span>件
            </PageCountText>
        )}

        <div className="max-w-[400px] mx-auto mb-10 md:mb-[56px]">
            <SearchForm />
        </div>

        {isNoProducts ? (
            <NoDataText />
        ) : <>
            {query && (
                <div className="max-w-4xl mx-auto">
                    <ProductList 
                        products={products as ProductWithReviews[]}
                    />

                    {totalPages > INITIAL_PAGE && (
                        <Pagination 
                            totalPages={totalPages}
                            currentPage={currentPage}
                            hasNextPage={hasNextPage}
                            hasPrevPage={hasPrevPage}
                        />
                    )}
                </div>
            )}
        </>}
    </>
}

export default SearchWrapper