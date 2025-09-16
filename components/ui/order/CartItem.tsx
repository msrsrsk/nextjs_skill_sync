"use client"

import Image from "next/image"
import Link from "next/link"
import { CircleX } from "lucide-react"

import CartQuantityInput from "@/components/ui/order/CartQuantityInput"
import ProductPrice from "@/components/ui/product/ProductPrice"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import FormErrorText from "@/components/common/forms/FormErrorText"
import useCartQuantityInput from "@/hooks/cart/useCartQuantityInput"
import { 
    NOIMAGE_PRODUCT_IMAGE_URL, 
    LOADING_SPINNER_SIZES, 
    PRODUCT_PRICE_TYPES,
    PRODUCT_QUANTITY_SIZES,
    SITE_MAP,
} from "@/constants/index"

const { LOADING_SMALL } = LOADING_SPINNER_SIZES;
const { PRICE_CART } = PRODUCT_PRICE_TYPES;
const { QUANTITY_MEDIUM } = PRODUCT_QUANTITY_SIZES;
const { CATEGORY_PATH } = SITE_MAP;

interface CartItemProps {
    item: CartItemWithProduct;
    index: number;
    cartLoading: boolean;
    displayQuantity: number;
    setDisplayQuantity: (quantity: number) => void;
    setModalActive: SetModalActive;
    setSelectedItem: (item: ProductId) => void;
}

const CartItem = ({ 
    item, 
    index,
    cartLoading,
    displayQuantity,
    setDisplayQuantity,
    setModalActive,
    setSelectedItem
}: CartItemProps) => {
    
    const {
        product,
    } = item;
    
    const {
        id: productId,
        title,
        image_urls,
        price,
        sale_price,
        category,
        slug,
        stock,
    } = product;

    const {
        loading: cartQuantityLoading,
        error: cartQuantityError,
        increaseQuantity,
        decreaseQuantity,
        handleQuantityChange
    } = useCartQuantityInput({
        productId: productId,
        quantity: displayQuantity,
        onQuantityUpdate: setDisplayQuantity,
    });

    return (
        <li 
            className={`flex items-center gap-2 justify-between py-5 px-[10px] md:py-6 md-lg:px-10${
                index >= 0 ? ' border-b border-dashed border-foreground last:border-b-0' : ''
            }`}
        >
            <div className="flex items-center gap-4 md:gap-10 lg-xl:gap-[64px]">
                <Link 
                    href={`${CATEGORY_PATH}/${category.toLowerCase()}/${slug}`} 
                    className="max-w-[120px] min-w-[80px] w-[23%] md:w-full"
                >
                    <Image 
                        src={image_urls || NOIMAGE_PRODUCT_IMAGE_URL} 
                        alt=""
                        width={120}
                        height={120}
                        className="image-common drop-shadow-light md:drop-shadow-main-sp"
                    />
                </Link>
                <div>
                    <h3 className="text-base md:text-lg leading-6 md:leading-[28px] font-poppins font-bold mb-1 md:mb-4">
                        {title}
                    </h3>
                    <div>
                        <div className="md:hidden">
                            <ProductPrice 
                                price={price}
                                salePrice={sale_price}
                                type={PRICE_CART}
                                stock={stock}
                            />
                        </div>
                        {cartQuantityLoading ? (
                            <LoadingSpinner size={LOADING_SMALL} />
                        ) : <>
                            <CartQuantityInput 
                                size={QUANTITY_MEDIUM} 
                                stock={stock}
                                quantity={displayQuantity}
                                onDecrement={() => decreaseQuantity()}
                                onIncrement={() => increaseQuantity()}
                                onQuantityChange={handleQuantityChange}
                            />
                            <FormErrorText errorList={
                                cartQuantityError ? [cartQuantityError] : []
                            } />
                        </>}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-10 md-lg:gap-[64px]">
                <div className="hidden md:block">
                    <ProductPrice 
                        price={price}
                        salePrice={sale_price}
                        type={PRICE_CART}
                        stock={stock}
                    />
                </div>
                <button 
                    onClick={() => {
                        setModalActive(true);
                        setSelectedItem(productId);
                    }} 
                    aria-label={`${title}をカートから削除する`}
                    disabled={cartLoading}
                >
                    <CircleX className="w-6 h-6" />
                </button>
            </div>
        </li>
    )
}

export default CartItem