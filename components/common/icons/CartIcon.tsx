import { ShoppingCart } from "lucide-react"

import IconBox from "@/components/common/icons/IconBox"
import { useCartStore } from "@/app/stores/useStore"
import { CART_ICON_STROKE_WIDTH, SITE_MAP } from "@/constants/index"

const { CART_PATH } = SITE_MAP;

interface CartIconProps {
    strokeWidth?: number;
    customClass?: string;
    onClick?: () => void;
}

const CartIcon = ({ 
    customClass, 
    strokeWidth = CART_ICON_STROKE_WIDTH,
    onClick
}: CartIconProps) => {
    const cartCount = useCartStore(state => state.cartCount);

    return (
        <IconBox link={CART_PATH} label="カートページを開く" onClick={onClick}>
            {cartCount > 0 && (
                <span 
                    className="absolute w-2 h-2 md-lg:w-[9px] md-lg:h-[9px] bg-brand rounded-full top-[13px] right-2 md-lg:top-[14px] md-lg:right-[10px]"
                    aria-label={`${cartCount}個の商品がカートに入っています`}
                />
            )}
            <ShoppingCart 
                className={customClass}
                strokeWidth={strokeWidth} 
            />
        </IconBox>
    )
}

export default CartIcon