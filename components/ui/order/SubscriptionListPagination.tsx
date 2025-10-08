"use client"

import { AnimatePresence } from "framer-motion"

import Pagination from "@/components/ui/navigation/Pagination"
import SubscriptionCard from "@/components/ui/order/SubscriptionCard"
import TabSwitcher from "@/components/common/display/TabSwitcher"
import PageCountText from "@/components/common/display/PageCountText"
import NoDataText from "@/components/common/display/NoDataText"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import FadeInUpContainer from "@/components/common/display/FadeInUpContainer"
import useTabPagination from "@/hooks/layout/useTabPagination"
import { 
    PAGINATION_CONFIG, 
    SUBSCRIPTION_HISTORY_CATEGORIES,
    TAB_TEXT_TYPES,
    SITE_MAP, 
} from "@/constants/index"

const { INITIAL_PAGE } = PAGINATION_CONFIG;
const { TAB_JA } = TAB_TEXT_TYPES;
const { SUBSCRIPTION_HISTORY_PATH } = SITE_MAP;

interface SubscriptionDataProps extends PaginationWithTotalCount {
    orderItems: OrderItem[];
}

interface SubscriptionListPaginationProps {
    subscriptionData: SubscriptionDataProps;
    currentCategory: SubscriptionHistoryCategoryType;
}

const SubscriptionListPagination = ({
    subscriptionData,
    currentCategory
}: SubscriptionListPaginationProps) => {
    const { activeTab, handleTabChange } = useTabPagination<SubscriptionHistoryCategoryType>({
        currentCategory,
        basePath: SUBSCRIPTION_HISTORY_PATH
    });

    const { 
        orderItems,
        totalCount,
        totalPages, 
        currentPage, 
        hasNextPage, 
        hasPrevPage 
    } = subscriptionData;

    return <>
        <PageCountText countText="契約数">
            <span className="page-numtext-num">
                {totalCount}
            </span>件
        </PageCountText>

        <TabSwitcher 
            categories={SUBSCRIPTION_HISTORY_CATEGORIES}
            activeTab={activeTab} 
            text={TAB_JA}
            setActiveTab={handleTabChange} 
            customClass="mt-10 mb-8 md:mt-[56px] md:mb-10 justify-center"
        />

        <div className="max-w-3xl mx-auto">
            {!orderItems ? (
                <LoadingSpinner />
            ) : orderItems.length === 0 ? (
                <AnimatePresence mode="wait">
                    <FadeInUpContainer animationKey={activeTab}>
                        <NoDataText />
                    </FadeInUpContainer>
                </AnimatePresence>
            ) : (
                <AnimatePresence mode="wait">
                    <FadeInUpContainer animationKey={activeTab}>
                        <div className="grid gap-6 md:gap-x-[42px] md:gap-y-14 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            {orderItems.map((orderItem, index) => (
                                <SubscriptionCard 
                                    orderItem={orderItem as OrderItemPagenatedData}
                                    key={index} 
                                />
                            ))}
                        </div>
                    </FadeInUpContainer>
                </AnimatePresence>
            )}

            {subscriptionData.totalPages > INITIAL_PAGE && (
                <Pagination 
                    totalPages={totalPages}
                    currentPage={currentPage}
                    hasNextPage={hasNextPage}
                    hasPrevPage={hasPrevPage}
                />
            )}
        </div>
    </>
}

export default SubscriptionListPagination