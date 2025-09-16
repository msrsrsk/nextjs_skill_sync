interface OrderAddressDisplayProps {
    title: string;
    name: string;
    address: ShippingAddress;
}

const OrderAddressDisplay = ({ 
    title, 
    name, 
    address 
}: OrderAddressDisplayProps) => {
    return (
        <div className="w-full md:w-1/2">
            <p className="order-card-infodt mb-1 md:mb-2">
                {title}
            </p>
            <p className="order-card-infodd">
                {name}<br />
                〒{address?.postal_code}<br />
                {address?.state && address?.state}
                {address?.city && address?.city}
                {address?.address_line1 && address?.address_line1}
                {address?.address_line2 && address?.address_line2}
            </p>
        </div>
    )
}

export default OrderAddressDisplay