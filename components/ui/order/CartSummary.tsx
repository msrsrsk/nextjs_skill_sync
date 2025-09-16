"use client"

import { useEffect } from "react"

import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import useCheckout from "@/hooks/cart/useCreateCheckout"
import useCartSubtotal from "@/hooks/cart/useCartSubtotal"
import InfoRow from "@/components/common/display/InfoRow"
import { formatNumber } from "@/lib/utils/format"

interface CartSummaryProps {
    cartItems: CartItemWithProduct[];
    optimisticQuantities: Record<ProductId, number>;
    optimisticCartItems: CartItemWithProduct[];
    setCartError: (error: string | null) => void;
}

const CartSummary = ({
    cartItems,
    optimisticQuantities,
    optimisticCartItems,
    setCartError,
}: CartSummaryProps) => {
    const { 
        subtotal, 
        loading: subtotalLoading, 
        error: subtotalError 
    } = useCartSubtotal({ 
        cartItems,
        optimisticQuantities
    });

    const { 
        initiateCheckout,
        loading: checkoutLoading,
        error: checkoutError
    } = useCheckout({ cartItems: optimisticCartItems });

    useEffect(() => {
        if (subtotalError || checkoutError) {
            setCartError(subtotalError || checkoutError);
        }
    }, [subtotalError, checkoutError]);

    return (
        <div className="max-w-xs mx-auto">
            {subtotalLoading ? (
                <LoadingSpinner />
            ) : <>
                <div className="mt-10 md:mt-[64px] mb-6 md:mb-8 flex justify-between">
                    <div className="grid gap-2">
                        <p 
                            className="text-base leading-none font-semibold font-poppins" 
                            aria-hidden="true"
                        >
                            Subtotal
                        </p>
                        <p className="text-base leading-none font-medium">小計</p>
                    </div>
                    <div 
                        className="grid justify-items-end gap-1" 
                        aria-label={`価格:${formatNumber(subtotal)}円（税込）`}
                    >
                        <div className="flex items-end gap-[3px]">
                            <span 
                                className="text-base leading-none font-semibold font-poppins" 
                                aria-hidden="true"
                            >
                                ¥
                            </span>
                            <span 
                                className="text-xl leading-none font-semibold font-poppins" 
                                aria-hidden="true"
                            >
                                {formatNumber(subtotal)}
                            </span>
                        </div>
                        <p 
                            className="text-base leading-none font-semibold font-poppins" 
                            aria-hidden="true"
                        >
                            tax inc.
                        </p>
                    </div>
                </div>

                <p className="text-xs leading-none font-medium text-center mb-4">
                    ※配送料はチェックアウト画面で計算されます
                </p>

                <div className="p-2 border border-foreground rounded-[12px] mb-8">
                    <button 
                        className="w-full min-h-[64px] bg-foreground text-white text-xl font-poppins font-bold leading-[32px] rounded-[8px] drop-shadow-cart flex items-center justify-center gap-2 disabled:opacity-40"
                        aria-label="注文する"
                        onClick={initiateCheckout}
                        disabled={checkoutLoading}
                    >
                        CHECKOUT 
                        {checkoutLoading && <span className="loading-spinner"></span>}
                    </button>
                </div>

                <div className="border border-dashed border-sub rounded-[12px] p-5 text-sub">
                    <p className="text-center text-sm md:text-[15px] leading-[30px] md:leading-[32px] font-medium mb-3">
                        テスト決済はこちら
                    </p>
                    <dl className="text-sm md:text-[15px] leading-[30px] md:leading-[32px] font-medium">
                        <InfoRow 
                            label="カード番号　　　　　 ：" 
                            value="4242 4242 4242 4242" 
                        />
                        <InfoRow 
                            label="有効期限　　　　　　 ：" 
                            value="有効な将来の日付" 
                        />
                        <InfoRow 
                            label="セキュリティーコード ：" 
                            value="任意の 3 桁の番号" 
                        />
                        <InfoRow 
                            label="その他　　　　　　　 ：" 
                            value="任意の値" 
                        />
                    </dl>
                </div>
            </>}
        </div>
    )
}

export default CartSummary