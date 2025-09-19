import Image from "next/image"
import Link from "next/link"

import ProductTag from "@/components/common/labels/ProductTag"
import { formatNumber } from "@/lib/utils/format"
import { NOIMAGE_PRODUCT_IMAGE_URL, SITE_MAP } from "@/constants/index"

const { CATEGORY_PATH } = SITE_MAP;

interface OrderItemListProps {
    orderItems: OrderItem[];
    customClass?: string;
}

const OrderItemList = ({ 
    orderItems, 
    customClass = "order-item-list"
}: OrderItemListProps) => {
    return (
        <div className={customClass}>
            {orderItems.map((item, index) => {
                const { product, quantity, unit_price, subscription_id, remarks } = item;
                const isSale = unit_price < product.price;
                const isRegularSale = isSale && !subscription_id;

                return (
                    <div key={index} className="flex items-center gap-4 md:gap-6">
                        <div className="max-w-[80px] min-w-[80px] md:w-full">
                            <Link href={
                                `${CATEGORY_PATH}/${product.category.toLowerCase()}/${product.slug}`
                            }>
                                <Image 
                                    src={product.image_urls || NOIMAGE_PRODUCT_IMAGE_URL} 
                                    alt=""
                                    width={80}
                                    height={80}
                                    className="image-common drop-shadow-light transform-gpu"
                                />
                            </Link>
                        </div>
                        <div>
                            <div className="mb-2">
                                <ProductTag category={product.category} />
                            </div>
                            <p className="text-sm md:text-base leading-[24px] md:leading-[28px] font-bold font-poppins mb-1">
                                {product.title}
                            </p>
                            <div 
                                className="product-list-pricebox"
                            >
                                <p aria-label={
                                    `価格:${formatNumber(unit_price)}円（税込）`
                                }>
                                    <span 
                                        className={`product-list-symbol${
                                            isRegularSale ? ' text-tag-default' : ''
                                        }`} 
                                        aria-hidden="true"
                                    >
                                        ¥
                                    </span>
                                    <span 
                                        className="product-list-price" 
                                        aria-hidden="true"
                                    >
                                        <span className={`${
                                            isRegularSale ? 'text-tag-default' : ''
                                        }`}>
                                            {formatNumber(unit_price)}
                                        </span>
                                        <span className="ml-1 text-sm"> /  </span>
                                        <span className="text-sub text-sm">
                                            数量: {quantity}点
                                        </span>
                                    </span>
                                </p>
                            </div>
                            {remarks && (
                                <div>
                                    <p className="text-sm leading-7 font-medium mt-1">
                                        {remarks}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default OrderItemList