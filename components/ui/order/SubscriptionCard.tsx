import OrderItemList from "@/components/ui/order/OrderItemList"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { formatDate } from "@/lib/utils/format"
import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { SITE_MAP } from "@/constants/index"

const { SUBSCRIPTION_HISTORY_PATH } = SITE_MAP;

const SubscriptionCard = async ({ orderItem }: { orderItem: OrderItem }) => {
    const {
        order_id,
        subscription_next_payment
    } = orderItem;

    const formattedNextPaymentDate = subscription_next_payment 
        ? formatDate(subscription_next_payment) : 'No data';

    return (
        <div className="bg-form-bg rounded-[20px] xl:max-w-[372px] w-full pt-6 px-5 pb-7 md:px-6">
            <OrderItemList 
                orderItems={[orderItem]} 
                customClass="grid gap-6"
            />
            <hr className="separate-border my-4 md:my-5" />
            <div className="grid gap-4">
                <div className="flex justify-center items-baseline flex-wrap gap-1">
                    <p className="text-sm leading-7 font-medium">次回のお支払い日：</p>
                    <p className="text-sm leading-7 font-medium font-poppins">{formattedNextPaymentDate}</p>
                </div>
                <LinkButtonPrimary
                    link={`${SUBSCRIPTION_HISTORY_PATH}/${order_id}`}
                    ariaLabel={`契約番号${orderItem.subscription_number}の詳細ページを開く`}
                >
                    <span aria-hidden="true">MORE</span>
                    <MoreIcon />
                </LinkButtonPrimary>
            </div>
        </div>
    )
}

export default SubscriptionCard