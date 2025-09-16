"use client"

import Link from "next/link"
import { useEffect } from "react"
import { usePathname } from "next/navigation"

import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import FormErrorText from "@/components/common/forms/FormErrorText"
import useAuth from "@/hooks/auth/useAuth"
import useIsSoldOut from "@/hooks/layout/useIsSoldOut"
import useCart from "@/hooks/cart/useCart"
import useCartToast from "@/hooks/cart/useCartToast"
import useCreatePaymentLink from "@/hooks/cart/useCreatePaymentLink"
import { 
    useCartStore, 
    useSubscriptionPurchaseTypeStore,
    useSelectedSubscriptionOptionStore
} from "@/app/stores/useStore"
import { PRODUCT_STOCK_THRESHOLD, SITE_MAP, SUBSCRIPTION_PURCHASE_TYPES } from "@/constants/index"

const { LOGIN_PATH } = SITE_MAP;
const { SUBSCRIPTION } = SUBSCRIPTION_PURCHASE_TYPES;

interface ProductPurchaseButtonProps {
    productId: ProductId;
    title: ProductTitle;
    imageUrls: ProductImageUrls;
    stock: ProductStock;
    isSubscription: boolean;
    isInvalid?: boolean;
    quantity: number;
}

const ProductPurchaseButton = ({ 
    productId,
    title,
    imageUrls,
    stock,
    isSubscription,
    isInvalid,
    quantity,
}: ProductPurchaseButtonProps) => {
    const pathname = usePathname();

    const { cartCount, setCartCount } = useCartStore();

    const { subscriptionPurchaseType } = useSubscriptionPurchaseTypeStore();
    const { selectedSubscriptionOption } = useSelectedSubscriptionOptionStore();

    const isSoldOut = useIsSoldOut(stock);

    const { 
        isAuthenticated, 
        loading: authLoading 
    } = useAuth();
    
    const { 
        loading: cartLoading,
        error: cartError,
        success: cartSuccess,
        addCart,
    } = useCart();

    const  {
        loading: paymentLinkLoading,
        error: paymentLinkError,
        createPaymentLink
    } = useCreatePaymentLink({
        subscriptionPriceId: selectedSubscriptionOption?.priceId || null,
        productId,
        interval: selectedSubscriptionOption?.interval || null
    });

    const { showCartAddedToast } = useCartToast({
        title,
        imageUrls
    });

    const isSubscriptionPurchase = isSubscription && subscriptionPurchaseType === SUBSCRIPTION;
    const isLoading = cartLoading || paymentLinkLoading;
    const isDisabled = isSoldOut || cartLoading || isInvalid;

    const handleAddToCart = () => {
        addCart({
            productId,
            quantity,
        });
    }

    useEffect(() => {
        if (cartSuccess) {
            setCartCount(cartCount + quantity);
            showCartAddedToast();
        }
    }, [cartSuccess]);

    if (authLoading) return <LoadingSpinner />

    return (
        <div className="mb-8">
            {isSubscriptionPurchase && (
                <p className="text-sm leading-6 text-error mb-3">
                    ※継続購入はご利用開始から最低 3 ヶ月間は解約できません
                </p>
            )}
            {isAuthenticated ? <>
                <div className="p-2 border border-foreground rounded-[12px]">
                    <button 
                        className="product-purchase__button"
                        aria-label={isSoldOut ? '売り切れ' : isSubscriptionPurchase ? 'サブスクリプション購入' : 'カートに追加する'}
                        onClick={isSubscriptionPurchase ? createPaymentLink : handleAddToCart}
                        disabled={isDisabled}
                    >
                        <span className="product-purchase__textbox">
                            <span aria-hidden="true">
                                {isSoldOut ? 'SOLD OUT' : isSubscriptionPurchase ? 'SUBSCRIBE' : 'ADD CART'}
                            </span>
                            {stock <= PRODUCT_STOCK_THRESHOLD && stock > 0 && (
                                <span className="text-sm mt-1">
                                    （ 在庫数残り{stock}点 ）
                                </span>
                            )}
                        </span>
                        {isLoading && (
                            <span className="loading-spinner"></span>
                        )}
                    </button>
                </div>
                <FormErrorText errorList={cartError ? [cartError] : []} />
                <FormErrorText errorList={paymentLinkError ? [paymentLinkError] : []} />
            </> : (
                <div className="p-2 border border-foreground rounded-[12px]">
                    <Link href={`${
                        LOGIN_PATH}?callbackUrl=${encodeURIComponent(pathname)
                    }`}>
                        <button 
                            className="cart-button text-base md:text-lg"
                            disabled={isSoldOut}
                        >
                            ログインして購入
                        </button>
                    </Link>
                </div>
            )}
        </div>
    )
}

export default ProductPurchaseButton