interface OrderInfoDisplayProps {
    label: string;
    children: React.ReactNode;
    customClass?: string;
}

const OrderInfoDisplay = ({ 
    label, 
    children, 
    customClass 
}: OrderInfoDisplayProps) => {
    return (
        <div className="order-info-item">
            <dt className="order-card-infodt">
                {label}：
            </dt>
            <dd className={`order-card-infodd${
                customClass ? ` ${customClass}` : ''
            }`}>
                {children}
            </dd>
        </div>
    )
}

export default OrderInfoDisplay