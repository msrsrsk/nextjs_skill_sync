import { Suspense } from "react"
import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import OrderHistoryListPagination from "@/components/ui/order/OrderHistoryListPagination"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import { generatePageMetadata } from "@/lib/metadata/page"
import { requireServerAuth } from "@/lib/middleware/auth"
import { getOrderRepository } from "@/repository/order"
import { ORDER_HISTORY_CATEGORIES, ORDER_HISTORY_PAGE_LIMIT, DEFAULT_PAGE } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"
import { USER_METADATA } from "@/constants/metadata/user"

const { CATEGORY_ALL } = ORDER_HISTORY_CATEGORIES;
const { ORDER_ERROR } = ERROR_MESSAGES;

export const metadata: Metadata = generatePageMetadata({
    ...USER_METADATA.ORDER_HISTORY
})

const OrderHistoryPage = ({ searchParams }: SearchParamsWithCategory) => {
    const page = parseInt(searchParams.page || DEFAULT_PAGE);
    const category = searchParams.category || CATEGORY_ALL;

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Order History" 
                customClass="mt-6 mb-3 md:mt-10 md:mb-4" 
            />

            <Suspense fallback={<LoadingSpinner />}>
                <OrderHistoryWrapper 
                    page={page} 
                    category={category} 
                />
            </Suspense>
        </div>
    </>
}

const OrderHistoryWrapper = async ({
    page,
    category
}: SearchParamsPageCategory) => {
    const { userId } = await requireServerAuth();

    const repository = getOrderRepository();
    const { data } = await repository.getUserPaginatedOrders({
        userId,
        category, 
        page, 
        limit: ORDER_HISTORY_PAGE_LIMIT
    });
    // const { data } = { data: undefined };

    if (!data) return <ErrorMessage message={ORDER_ERROR.HISTORY_FETCH_FAILED} />

    return (
        <OrderHistoryListPagination 
            orderData={data as OrderPagenatedProps} 
            currentCategory={category} 
        />
    )
}

export default OrderHistoryPage