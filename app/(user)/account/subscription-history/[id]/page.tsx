import { notFound } from "next/navigation"
import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import UnderlineLink from "@/components/common/buttons/UnderlineLink"
import OrderStatus from "@/components/common/labels/OrderStatus"
import OrderItemList from "@/components/ui/order/OrderItemList"
import PageCountText from "@/components/common/display/PageCountText"
import SubscriptionCancelButton from "@/components/ui/order/SubscriptionCancelButton"
import SubscriptionContractHistory from "@/components/ui/order/SubscriptionContractHistory"
import OrderPriceDisplay from "@/components/ui/order/OrderPriceDisplay"
import OrderStatusDisplay from "@/components/ui/order/OrderStatusDisplay"
import OrderInfoDisplay from "@/components/ui/order/OrderInfoDisplay"
import OrderAddressDisplay from "@/components/ui/order/OrderAddressDisplay"
import { getOrderByIdData } from "@/lib/database/prisma/actions/orders"
import { generatePageMetadata } from "@/lib/metadata/page"
import { formatDate } from "@/lib/utils/format"
import { formatOrderNumber } from "@/lib/utils/format"
import { 
    ORDER_DISPLAY_TYPES, 
    ORDER_STATUS_DISPLAY_TYPES, 
    SUBSCRIPTION_STATUS,
    SITE_MAP 
} from "@/constants/index"

const { ORDER_DETAIL } = ORDER_DISPLAY_TYPES;
const { CARD } = ORDER_STATUS_DISPLAY_TYPES;
const { SUBS_ACTIVE, SUBS_CANCELLED } = SUBSCRIPTION_STATUS;
const { SUBSCRIPTION_HISTORY_PATH } = SITE_MAP;

export async function generateMetadata({ 
    params 
}: { params: { id: OrderId } }): Promise<Metadata> {
    const { id } = params;

    return generatePageMetadata({
        title: 'サブスクリプション詳細',
        description: 'お客様のサブスクリプションのご契約の詳細を確認することができます。',
        url: `${SUBSCRIPTION_HISTORY_PATH}/${id}`,
        robots: {
            index: false,
            follow: false,
        }
    });
}

const SubscriptionHistoryDetailPage = async ({ params }: { params: { id: OrderId } }) => {
    const orderResult = await getOrderByIdData({
        orderId: params.id,
        isSubscription: true
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

    const subscriptionId = order_items[0].subscription_id;
    const subscriptionStatus = order_items[0].subscription_status;
    const nextPaymentDate = order_items[0].subscription_next_payment;
    const formattedNextPaymentDate = nextPaymentDate ? formatDate(nextPaymentDate) : 'No data';

    const isActive = subscriptionStatus === SUBS_ACTIVE;
    const isCancelled = subscriptionStatus === SUBS_CANCELLED;

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title="Sub Details" 
                customClass="mt-6 mb-3 md:mt-10 md:mb-4" 
            />

            <PageCountText countText="契約番号" customClass="mb-10 md:mb-[56px]">
                <span className="order-numtext">
                    {formatOrderNumber(order_number, 'SUB')}
                </span>
            </PageCountText>

            <div className="order-wrapper">
                <div className="order-inner">

                {/* サブスクタイトルと解約ボタン */}
                    <div className="order-title-box">
                        <h4 className="order-title">
                            サブスクリプションの詳細
                        </h4>
                        <div className="hidden md:block">
                            <SubscriptionCancelButton 
                                subscriptionId={subscriptionId}
                                createdAt={created_at}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 md:gap-10 md:items-start pb-4 md:pb-10 border-b border-foreground">
                        {/* 契約商品の情報 */}
                        <div className="lg:max-w-[440px] w-full">
                            <OrderItemList 
                                orderItems={order_items} 
                                customClass="grid gap-6" 
                            />

                            <hr className="border-b border-foreground my-4 md:my-6" />

                            <div className="w-full">
                                <dl className="order-info-dl">
                                    <OrderInfoDisplay
                                        label="契約ID　　　"
                                        customClass="font-poppins"
                                    >
                                        {subscriptionId}
                                    </OrderInfoDisplay>
                                    <OrderInfoDisplay
                                        label="契約開始日　"
                                        customClass="font-poppins"
                                    >
                                        {formatDate(created_at)}
                                    </OrderInfoDisplay>
                                    <OrderInfoDisplay
                                        label="次回支払日　"
                                        customClass={`${
                                            isActive 
                                                ? 'font-poppins' : ''
                                        }`}
                                    >
                                        {isCancelled 
                                            ? '解約済み' : formattedNextPaymentDate
                                        }
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

                        {/* 契約履歴 */}
                        <SubscriptionContractHistory
                            order_items={order_items}
                            orderId={params.id}
                        />
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
                        <SubscriptionCancelButton 
                            subscriptionId={subscriptionId}
                            createdAt={created_at}
                        />
                    </div>
                </div>

                <UnderlineLink 
                    href={SUBSCRIPTION_HISTORY_PATH} 
                    text="Back" 
                    customClass="mt-10 md:mt-[64px]" 
                />
            </div>
        </div>
    </>
}

export default SubscriptionHistoryDetailPage