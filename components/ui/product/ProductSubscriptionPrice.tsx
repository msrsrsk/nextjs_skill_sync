"use client"

import ProductStatus from "@/components/common/labels/ProductStatus"
import useIsSoldOut from "@/hooks/layout/useIsSoldOut"
import { 
    useSubscriptionPurchaseTypeStore,
    useSelectedSubscriptionOptionStore
} from "@/app/stores/useStore"
import { formatNumber } from "@/lib/utils/format"
import { 
    PRODUCT_PRICE_STATUS, 
    PRODUCT_STATUS_SIZES, 
    SUBSCRIPTION_PURCHASE_TYPES
} from "@/constants/index"

const { PRODUCT_SALE, PRODUCT_SOLDOUT } = PRODUCT_PRICE_STATUS;
const { STATUS_MEDIUM } = PRODUCT_STATUS_SIZES;
const { SUBSCRIPTION, ONE_TIME } = SUBSCRIPTION_PURCHASE_TYPES;

interface GetProductStatusProps {
    salePrice: number | null;
    isSoldOut: boolean;
}

interface ProductPriceProps {
    price: ProductPrice;
    salePrice: ProductSalePriceType;
    stock: ProductStock;
}

const getProductStatus = ({ salePrice, isSoldOut }: GetProductStatusProps) => {
    if (isSoldOut) return PRODUCT_SOLDOUT;
    if (salePrice) return PRODUCT_SALE;
    return undefined;
};

const ProductSubscriptionPrice = ({ 
    price, 
    salePrice, 
    stock,
}: ProductPriceProps) => {
    const { subscriptionPurchaseType } = useSubscriptionPurchaseTypeStore();
    const { selectedSubscriptionOption } = useSelectedSubscriptionOptionStore();

    const isSoldOut = useIsSoldOut(stock);
    const productStatus = getProductStatus({ salePrice, isSoldOut });
    
    const subscriptionPrice = selectedSubscriptionOption?.price || price;
    const displayPrice = subscriptionPurchaseType === SUBSCRIPTION 
        ? subscriptionPrice 
        : salePrice || subscriptionPrice;

    const showOriginalPrice = !isSoldOut && salePrice && subscriptionPurchaseType === ONE_TIME;

    return (
        <div className="mb-4">
            {showOriginalPrice && (
                <div 
                    className="mb-3" 
                    aria-hidden="true"
                >
                    <span className="price-text pr-[2px] text-lg">¥</span>
                    <span className="price-text line-through text-2xl">
                        {formatNumber(price)}
                    </span>
                </div>
            )}
            <div className="flex flex-row items-center flex-wrap gap-2 md:gap-3">
                <p 
                    aria-label={`価格:${formatNumber(displayPrice)}円（税込）`} 
                    className={`${
                        !isSoldOut && salePrice ? 'text-tag-default' : 
                        isSoldOut ? ' text-sub' : ' text-foreground'
                    }`}
                >
                    <span 
                        className="price-text pr-[2px] text-lg"
                        aria-hidden="true"
                    >
                        ¥
                    </span>
                    <span 
                        className="price-text text-2xl"
                        aria-hidden="true"
                    >
                        {!isSoldOut && salePrice ? formatNumber(salePrice) : formatNumber(displayPrice)}
                    </span>
                    <span 
                        className="font-poppins font-semibold text-sm leading-[18px] pl-2 md:pl-3"
                        aria-hidden="true"
                    >
                        tax inc.
                    </span>
                </p>
                {productStatus && 
                    <ProductStatus 
                        status={productStatus} 
                        size={STATUS_MEDIUM} 
                    />
                }
            </div>
        </div>
    )
}

export default ProductSubscriptionPrice