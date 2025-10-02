import { notFound } from "next/navigation"
import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import UnderlineLink from "@/components/common/buttons/UnderlineLink"
import OrderStatus from "@/components/common/labels/OrderStatus"
import OrderItemList from "@/components/ui/order/OrderItemList"
import PageCountText from "@/components/common/display/PageCountText"
import OrderReceiptDownloadButton from "@/components/ui/order/OrderReceiptDownloadButton"
import OrderPriceDisplay from "@/components/ui/order/OrderPriceDisplay"
import OrderStatusDisplay from "@/components/ui/order/OrderStatusDisplay"
import OrderInfoDisplay from "@/components/ui/order/OrderInfoDisplay"
import OrderAddressDisplay from "@/components/ui/order/OrderAddressDisplay"
import { generatePageMetadata } from "@/lib/metadata/page"
import { formatDate } from "@/lib/utils/format"
import { getOrderRepository } from "@/repository/order"
import { formatOrderNumber } from "@/services/order/format"
import { 
    ORDER_STATUS, 
    ORDER_DISPLAY_TYPES, 
    ORDER_STATUS_DISPLAY_TYPES, 
    SITE_MAP 
} from "@/constants/index"

const { ORDER_PROCESSING, ORDER_SHIPPED, ORDER_DELIVERED } = ORDER_STATUS;
const { ORDER_DETAIL } = ORDER_DISPLAY_TYPES;
const { STATUS, CARD } = ORDER_STATUS_DISPLAY_TYPES;
const { ORDER_HISTORY_PATH } = SITE_MAP;

export async function generateMetadata({ 
    params 
}: { params: { id: OrderId } }): Promise<Metadata> {
    const { id } = params;

    return generatePageMetadata({
        title: '注文詳細',
        description: 'お客様のご注文の詳細を確認することができます。',
        url: `${ORDER_HISTORY_PATH}/${id}`,
        robots: {
            index: false,
            follow: false,
        }
    });
}

const OrderHistoryDetailPage = async ({ params }: { params: { id: OrderId } }) => {
    const repository = getOrderRepository();
    const orderResult = await repository.getOrderById({
        orderId: params.id
    });

    if (!orderResult) notFound();

    const { 
        created_at, 
        status, 
        shipping_fee,
        order_items,
        order_number,
        total_amount,
        payment_method,
        address,
        delivery_name
    } = orderResult as OrderWithOrderItems;

    const isSubscription = !!order_items[0].subscription_id;

    const showReceiptDownloadButton = 
        status === ORDER_PROCESSING || 
        status === ORDER_SHIPPED || 
        status === ORDER_DELIVERED;

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Order Details" 
                customClass="mt-6 mb-3 md:mt-10 md:mb-4" 
            />

            <PageCountText countText="注文番号" customClass="mb-10 md:mb-[56px]">
                <span className="order-numtext">
                    {formatOrderNumber(order_number)}
                </span>
            </PageCountText>

            <div className="order-wrapper">
                <div className="order-inner">

                {/* 注文タイトルと納品書のダウンロードボタン */}
                    <div className="order-title-box">
                        <h4 className="order-title">
                            注文内容の詳細
                        </h4>
                        <div className="hidden md:block">
                            <OrderReceiptDownloadButton 
                                id={params.id} 
                                showReceiptDownloadButton={showReceiptDownloadButton} 
                                isSubscription={isSubscription}
                            />
                        </div>
                    </div>

                    <div className="order-details-box">
                        {/* 注文商品一覧 */}
                        <OrderItemList orderItems={order_items} />

                        {/* 注文情報 */}
                        <div className="w-full">
                            <dl className="order-info-dl">
                                <OrderInfoDisplay
                                    label="注文日　　　"
                                    customClass="font-poppins"
                                >
                                    {formatDate(created_at)}
                                </OrderInfoDisplay>
                                <OrderInfoDisplay
                                    label="注文状況　　"
                                >
                                    <OrderStatus 
                                        status={status} 
                                        type={ORDER_DETAIL} 
                                    />
                                </OrderInfoDisplay>

                                <hr className="separate-border my-4 md:my-6" />

                                <OrderStatusDisplay 
                                    label="支払い状況　" 
                                    target={status}
                                    type={STATUS}
                                />
                                <OrderStatusDisplay 
                                    label="支払い方法　" 
                                    target={payment_method}
                                    type={CARD}
                                />

                                <hr className="separate-border my-4 md:my-6" />

                                <OrderPriceDisplay 
                                    label="小計　　　　" 
                                    amount={total_amount - shipping_fee}
                                />
                                <OrderPriceDisplay 
                                    label="配送料　　　" 
                                    amount={shipping_fee}
                                />
                                <OrderPriceDisplay 
                                    label="合計　　　　" 
                                    amount={total_amount}
                                />
                            </dl>
                        </div>
                    </div>

                    {/* 住所情報 */}
                    <div className="order-address-box">
                        <OrderAddressDisplay
                            title="お届け先"
                            name={delivery_name}
                            address={address as ShippingAddress}
                        />
                        <OrderAddressDisplay
                            title="請求先"
                            name={delivery_name}
                            address={address as ShippingAddress}
                        />
                    </div>

                    <div className="order-download-btnbox">
                        <OrderReceiptDownloadButton 
                            id={params.id} 
                            showReceiptDownloadButton={showReceiptDownloadButton} 
                        />
                    </div>
                </div>

                <UnderlineLink 
                    href={ORDER_HISTORY_PATH} 
                    text="Back" 
                    customClass="mt-10 md:mt-[64px]" 
                />
            </div>
        </div>
    </>
}

export default OrderHistoryDetailPage