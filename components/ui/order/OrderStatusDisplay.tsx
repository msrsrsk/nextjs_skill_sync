import { formatPaymentStatus, formatPaymentCardBrand } from "@/lib/utils/format"
import { ORDER_STATUS_DISPLAY_TYPES } from "@/constants/index"

const { STATUS } = ORDER_STATUS_DISPLAY_TYPES;

interface OrderStatusDisplayProps {
    label: string;
    target: OrderPaymentMethod;
    type: OrderStatusDisplayType;
}

const OrderStatusDisplay = ({ 
    label, 
    target,
    type
}: OrderStatusDisplayProps) => {
    if (!target) return null;
    
    return (
        <div className="order-info-item">
            <dt className="order-card-infodt">
                {label}：
            </dt>
            <dd className="order-card-infodd">
                {type === STATUS 
                    ? formatPaymentStatus(target as OrderStatus) 
                    : formatPaymentCardBrand(target)
                }
            </dd>
        </div>
    )
}

export default OrderStatusDisplay