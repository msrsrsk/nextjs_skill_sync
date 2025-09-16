import Image from "next/image"
import { useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { ShoppingCart } from "lucide-react"

import { showCustomToast } from "@/components/common/display/Toasts"
import { EventButtonPrimary } from "@/components/common/buttons/Button"
import { CheckIcon } from "@/components/common/icons/SvgIcons"
import { 
    NOIMAGE_PRODUCT_IMAGE_URL, 
    BUTTON_SIZES, 
    BUTTON_TEXT_TYPES, 
    SITE_MAP 
} from "@/constants/index"

const { BUTTON_LARGE } = BUTTON_SIZES;
const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { CART_PATH } = SITE_MAP;

interface UseCartToastProps {
    title: ProductTitle;
    imageUrls: ProductImageUrls;
}

const useCartToast = ({ title, imageUrls }: UseCartToastProps) => {
    const router = useRouter();
    const toastIdRef = useRef<string | null>(null);

    const handleRedirectToCart = () => {
        if (toastIdRef.current) {
            toast.dismiss(toastIdRef.current);
        }
        router.push(CART_PATH);
    }

    const showCartAddedToast = () => {
        const toastId = showCustomToast(
            <>
                <div className="flex items-center justify-center gap-[10px]">
                    <CheckIcon 
                        customClass="toast-icon" 
                        color="#39CC6F" 
                    />
                    <span className="text-sm md:text-base font-zen font-bold text-tag-voices">
                        カートに商品を追加しました
                    </span>
                </div>
                <div>
                    <div className="flex items-center justify-center gap-[10px] md:gap-4">
                        <Image 
                            src={imageUrls || NOIMAGE_PRODUCT_IMAGE_URL} 
                            alt=""
                            width={64} 
                            height={64} 
                            className="drop-shadow-light"
                        />
                        <p className="text-sm leading-4 font-bold font-poppins">
                            {title}
                        </p>
                    </div>
                    <EventButtonPrimary
                        onClick={handleRedirectToCart}
                        customClass="mt-4 md:mt-5"
                        size={BUTTON_LARGE}
                        text={BUTTON_JA}
                    >
                        カートを見る
                        <ShoppingCart 
                            className="w-5 h-5" 
                            fill="#fffff" 
                            strokeWidth={2.2} 
                        />
                    </EventButtonPrimary>
                </div>
            </>
        );

        toastIdRef.current = toastId;
    }

    return { showCartAddedToast }
}

export default useCartToast