import { formatNumber } from "@/lib/utils/format"

interface OrderPriceDisplayProps {
    label: string;
    amount: number;
}

const OrderPriceDisplay = ({ label, amount }: OrderPriceDisplayProps) => {
    return (
        <div className="order-info-item">
            <dt className="order-card-infodt">
                {label}：
            </dt>
            <dd className="text-base leading-[20px] font-medium">
                <p aria-label={
                    `価格:${formatNumber(amount)}円（税込）`
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
                        {formatNumber(amount)}
                    </span>
                </p>
            </dd>
        </div>
    )
}

export default OrderPriceDisplay