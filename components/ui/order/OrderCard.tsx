import OrderStatus from "@/components/common/labels/OrderStatus"
import OrderItemList from "@/components/ui/order/OrderItemList"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { formatDate } from "@/lib/utils/format"
import { formatNumber } from "@/lib/utils/format"
import { formatPaymentStatus } from "@/services/order/format"
import { SITE_MAP } from "@/constants/index"

const { ORDER_HISTORY_PATH } = SITE_MAP;

const OrderCard = ({ order }: { order: OrderWithOrderItems }) => {
    const { 
        created_at, 
        status, 
        order_items,
        order_number,
        total_amount
    } = order;

    return (
        <div className="bg-soft-white rounded-sm py-6 px-5 md:px-10 md:pb-7">
            {/* 注文日と注文状況 */}
            <div className="flex justify-between items-center mb-5 md:mb-4">
                <dl className="flex items-baseline flex-col md:flex-row gap-3 md:gap-6 md-lg:gap-10">
                    <div className="flex gap-2">
                        <dt className="order-card-statusdt">
                            注文日<span className="md:hidden">　</span>：
                        </dt>
                        <dd className="text-[17px] md:text-[21px] leading-[20px] font-medium font-poppins">
                            {formatDate(created_at)}
                        </dd>
                    </div>
                    <div className="flex gap-2 items-baseline">
                        <dt className="order-card-statusdt">注文状況：</dt>
                        <dd>
                            <OrderStatus status={status} />
                        </dd>
                    </div>
                </dl>
                <div className="hidden md:block">
                    <MoreButton order={order} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-10 md:items-center">
                {/* 注文商品一覧 */}
                <OrderItemList orderItems={order_items} />

                {/* 注文情報 */}
                <div className="w-full">
                    <dl className="grid gap-1 md:gap-2">
                        <div className="flex gap-[14px] md:gap-5">
                            <dt className="order-card-infodt">注文番号　　：</dt>
                            <dd className="order-card-infodd font-poppins">
                                {order_number}
                            </dd>
                        </div>
                        <div className="flex gap-[14px] md:gap-5">
                            <dt className="order-card-infodt">支払い状況　：</dt>
                            <dd className="order-card-infodd">
                                {formatPaymentStatus(status)}
                            </dd>
                        </div>
                        <div className="flex gap-[14px] md:gap-5">
                            <dt className="order-card-infodt">合計　　　　：</dt>
                            <dd className="text-base leading-[20px] font-medium">
                                <p aria-label={`価格:${
                                    formatNumber(total_amount)}円（税込）`
                                }>
                                    <span 
                                        className="product-list-symbol" 
                                        aria-hidden="true"
                                    >
                                        ¥
                                    </span>
                                    <span 
                                        className="text-sm md:text-base leading-none font-medium font-poppins" 
                                        aria-hidden="true"
                                    >
                                        {formatNumber(total_amount)}
                                    </span>
                                </p>
                            </dd>
                        </div>
                    </dl>

                    <div className="block md:hidden mt-4">
                        <MoreButton order={order} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const MoreButton = ({ order }: { order: OrderWithOrderItems }) => (
    <LinkButtonPrimary
        link={`${ORDER_HISTORY_PATH}/${order.id}`}
        ariaLabel={`注文番号${order.order_number}の詳細ページを開く`}
    >
        <span aria-hidden="true">MORE</span>
        <MoreIcon />
    </LinkButtonPrimary>
)

export default OrderCard