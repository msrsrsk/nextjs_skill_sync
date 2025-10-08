"use client"

import { AnimatePresence } from "framer-motion"

import Pagination from "@/components/ui/navigation/Pagination"
import OrderCard from "@/components/ui/order/OrderCard"
import TabSwitcher from "@/components/common/display/TabSwitcher"
import PageCountText from "@/components/common/display/PageCountText"
import NoDataText from "@/components/common/display/NoDataText"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import FadeInUpContainer from "@/components/common/display/FadeInUpContainer"
import useTabPagination from "@/hooks/layout/useTabPagination"
import { 
    ORDER_HISTORY_CATEGORIES, 
    TAB_TEXT_TYPES, 
    PAGINATION_CONFIG,
    SITE_MAP 
} from "@/constants/index"

const { INITIAL_PAGE } = PAGINATION_CONFIG;
const { TAB_JA } = TAB_TEXT_TYPES;
const { ORDER_HISTORY_PATH } = SITE_MAP;

interface OrderHistoryListPaginationProps {
    orderData: OrderPagenatedProps;
    currentCategory: OrderHistoryCategoryType;
}

const OrderHistoryListPagination = ({
    orderData,
    currentCategory
}: OrderHistoryListPaginationProps) => {
    const { activeTab, handleTabChange } = useTabPagination<OrderHistoryCategoryType>({
        currentCategory,
        basePath: ORDER_HISTORY_PATH
    });

    const { 
        orders,
        totalCount,
        totalPages, 
        currentPage, 
        hasNextPage, 
        hasPrevPage 
    } = orderData;

    if (totalCount === 0) return <NoDataText />

    return <>
        <PageCountText countText="購入履歴">
            <span className="page-numtext-num">
                {totalCount}
            </span>件
        </PageCountText>

        <TabSwitcher 
            categories={ORDER_HISTORY_CATEGORIES}
            activeTab={activeTab} 
            text={TAB_JA}
            setActiveTab={handleTabChange} 
            customClass="mt-10 mb-8 md:mt-[56px] md:mb-10 justify-center"
        />

        <div className="max-w-2xl mx-auto">
            {!orders ? (
                <LoadingSpinner />
            ) : orders.length === 0 ? (
                <AnimatePresence mode="wait">
                    <FadeInUpContainer animationKey={activeTab}>
                        <NoDataText />
                    </FadeInUpContainer>
                </AnimatePresence>
            ) : (
                <AnimatePresence mode="wait">
                    <FadeInUpContainer animationKey={activeTab}>
                        <div className="grid gap-6 mb-10">
                            {orders.map((order, index) => (
                                <OrderCard 
                                    order={order}
                                    key={index} 
                                />
                            ))}
                        </div>
                    </FadeInUpContainer>
                </AnimatePresence>
            )}

            {orderData.totalPages > INITIAL_PAGE && (
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

export default OrderHistoryListPagination