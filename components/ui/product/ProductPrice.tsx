"use client"

import ProductStatus from "@/components/common/labels/ProductStatus"
import useIsSoldOut from "@/hooks/layout/useIsSoldOut"
import { formatNumber } from "@/lib/utils/format"
import { 
    PRODUCT_PRICE_STATUS, 
    PRODUCT_STATUS_SIZES, 
    PRODUCT_PRICE_TYPES 
} from "@/constants/index"

const { PRODUCT_SALE, PRODUCT_SOLDOUT } = PRODUCT_PRICE_STATUS;
const { STATUS_SMALL, STATUS_MEDIUM } = PRODUCT_STATUS_SIZES;
const { PRICE_LIST, PRICE_DETAIL, PRICE_CART } = PRODUCT_PRICE_TYPES;

interface GetProductStatusProps {
    salePrice: number | null;
    isSoldOut: boolean;
}

interface ProductPriceProps {
    price: ProductPrice;
    salePrice: ProductSalePriceType;
    stock: ProductStock;
    type?: ProductPriceType;
}

const getProductStatus = ({ salePrice, isSoldOut }: GetProductStatusProps) => {
    if (isSoldOut) return PRODUCT_SOLDOUT;
    if (salePrice) return PRODUCT_SALE;
    return undefined;
};

const ProductPrice = ({ 
    price, 
    salePrice, 
    type = PRICE_LIST,
    stock
}: ProductPriceProps) => {
    const isSoldOut = useIsSoldOut(stock);
    const productStatus = getProductStatus({ salePrice, isSoldOut });

    const isList = type === PRICE_LIST;
    const isDetail = type === PRICE_DETAIL;
    const isCart = type === PRICE_CART;

    const displayPrice = salePrice || price;

    if (isCart) {
        return (
            <div className="mb-4 md:mb-0">
                <p 
                    aria-label={`価格:${formatNumber(displayPrice)}円（税込）`} 
                    className={`price-text${
                        salePrice ? ' text-tag-default' : ''
                    }`}
                >
                    <span className="text-xs" aria-hidden="true">¥</span>
                    <span className="text-base" aria-hidden="true">{formatNumber(displayPrice)}</span>
                </p>
            </div>
        )
    } 

    if (isList || isDetail) {
        return (
            <div className={`${isDetail ? 'mb-4' : ''}`}>
                {!isSoldOut && salePrice && (
                    <div 
                        className={`${isDetail ? 'mb-3' : 'mb-1'}`} 
                        aria-hidden="true"
                    >
                        <span className={`price-text pr-[2px]${
                                isList ? ' text-xs' : ' text-lg'
                            }`} >
                            ¥
                        </span>
                        <span className={`price-text line-through${
                                isList ? ' text-base' : ' text-2xl'
                            }`}>
                            {formatNumber(price)}
                        </span>
                    </div>
                )}
                <div 
                    className={`flex flex-row items-center flex-wrap${
                        isList ? ' gap-[6px]' : ' gap-2 md:gap-3'
                    }`}
                >
                    <p 
                        aria-label={`価格:${formatNumber(displayPrice)}円（税込）`} 
                        className={`${
                            !isSoldOut && salePrice ? 'text-tag-default' : 
                            isSoldOut ? ' text-sub' : ' text-foreground'
                        }`}
                    >
                        <span 
                            className={`price-text pr-[2px]${
                                isList ? ' text-xs' : ' text-lg'
                            }`} 
                            aria-hidden="true"
                        >
                            ¥
                        </span>
                        <span 
                            className={`price-text${
                                isList ? ' text-base' : ' text-2xl'
                            }`}
                            aria-hidden="true"
                        >
                            {!isSoldOut && salePrice ? formatNumber(salePrice) : formatNumber(price)}
                        </span>
                        <span 
                            className={`font-poppins font-semibold${
                                isList ? ' text-xs leading-none pl-[6px]' : 
                                ' text-sm leading-[18px] pl-2 md:pl-3'
                            }`} 
                            aria-hidden="true"
                        >
                            tax inc.
                        </span>
                    </p>
                    {productStatus && 
                        <ProductStatus 
                            status={productStatus} 
                            size={isList ? STATUS_SMALL : STATUS_MEDIUM} 
                        />
                    }
                </div>
            </div>
        )
    }

}

export default ProductPrice