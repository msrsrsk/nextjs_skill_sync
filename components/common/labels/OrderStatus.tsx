import { formatOrderStatus } from "@/lib/utils/format"
import { ORDER_STATUS, ORDER_DISPLAY_TYPES } from "@/constants/index"

const { ORDER_PROCESSING, ORDER_SHIPPED } = ORDER_STATUS;
const { ORDER_LIST, ORDER_DETAIL } = ORDER_DISPLAY_TYPES;

interface OrderStatusProps {
    status: OrderStatusType;
    type?: OrderDisplayType;
}

const OrderStatus = ({ 
    status, 
    type = ORDER_LIST
}: OrderStatusProps) => {
    return (
        <span 
            className={`order-status${
                status === ORDER_PROCESSING ? ' is-unshipped' : ''}${
                status === ORDER_SHIPPED ? ' is-shipped' : ''}${
                type === ORDER_DETAIL ? ' is-detail' : ''
            }`}
            aria-label={formatOrderStatus(status)}
        >
            {formatOrderStatus(status)}
        </span>
    )
}

export default OrderStatus