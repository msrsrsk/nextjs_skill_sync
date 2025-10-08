import { Suspense } from "react"
import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import SubscriptionListPagination from "@/components/ui/order/SubscriptionListPagination"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import { generatePageMetadata } from "@/lib/metadata/page"
import { requireServerAuth } from "@/lib/middleware/auth"
import { getOrderItemRepository } from "@/repository/orderItem"
import { 
    SUBSCRIPTION_ORDER_HISTORY_PAGE_LIMIT, 
    SUBSCRIPTION_HISTORY_CATEGORIES,
    DEFAULT_PAGE, 
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"
import { USER_METADATA } from "@/constants/metadata/user"

const { CATEGORY_SUBS_ACTIVE } = SUBSCRIPTION_HISTORY_CATEGORIES;
const { ORDER_ERROR } = ERROR_MESSAGES;

export const metadata: Metadata = generatePageMetadata({
    ...USER_METADATA.SUBSCRIPTION_HISTORY
})

const SubscriptionHistoryPage = ({ searchParams }: SearchParamsWithCategory) => {
    const page = parseInt(searchParams.page || DEFAULT_PAGE);
    const category = searchParams.category || CATEGORY_SUBS_ACTIVE;

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Sub History" 
                customClass="mt-6 mb-3 md:mt-10 md:mb-4" 
            />

            <Suspense fallback={<LoadingSpinner />}>
                <SubscriptionWrapper 
                    page={page} 
                    category={category} 
                />
            </Suspense>
        </div>
    </>
}

const SubscriptionWrapper = async ({ 
    page,
    category
}: SearchParamsPageCategory) => {
    const { userId } = await requireServerAuth();

    const repository = getOrderItemRepository();
    const { data } = await repository.getUserPaginatedSubscription({
        userId,
        category,
        page, 
        limit: SUBSCRIPTION_ORDER_HISTORY_PAGE_LIMIT
    });
    // const { data } = { data: undefined };

    if (!data) return <ErrorMessage message={ORDER_ERROR.HISTORY_FETCH_FAILED} />

    return (
        <SubscriptionListPagination 
            subscriptionData={data} 
            currentCategory={category as SubscriptionHistoryCategoryType}
        />
    )
}

export default SubscriptionHistoryPage