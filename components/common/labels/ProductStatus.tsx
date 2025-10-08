import { formatProductPriceStatus } from "@/services/product/format"
import { PRODUCT_PRICE_STATUS, PRODUCT_STATUS_SIZES } from "@/constants/index"

const { PRODUCT_SALE, PRODUCT_SOLDOUT } = PRODUCT_PRICE_STATUS;
const { STATUS_SMALL } = PRODUCT_STATUS_SIZES;

interface ProductStatusProps {
    status?: ProductPriceStatusType;
    size?: ProductStatusSizeType;
}

const ProductStatus = ({ 
    status, 
    size = STATUS_SMALL
}: ProductStatusProps) => {
    return <>
        {status && (
            <div 
                className={`product-status${
                    status === PRODUCT_SALE ? ' is-sale' : ''}${
                    status === PRODUCT_SOLDOUT ? ' is-soldout' : ''}${
                    size === STATUS_SMALL ? ' is-small' : ' is-medium'
                }`}
                aria-label={formatProductPriceStatus(status)}
            >
                <span aria-hidden="true">{status}</span>
            </div>
        )}
    </>
}

export default ProductStatus