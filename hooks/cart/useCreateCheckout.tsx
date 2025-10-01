import { useState } from "react"
import { useRouter } from "next/navigation"

import { showErrorToast } from "@/components/common/display/Toasts"
import { GET_PRODUCTS_PAGE_TYPES, CHECKOUT_SHOW_TOAST_DELAY, SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CART } = GET_PRODUCTS_PAGE_TYPES;
const { PRODUCTS_API_PATH, CHECKOUT_API_PATH } = SITE_MAP;
const { CHECKOUT_ERROR } = ERROR_MESSAGES;

const useCheckout = ({ cartItems }: { cartItems: CartItemWithProduct[] }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    // 在庫チェック
    const checkStockAvailability = async () => {
        try {
            const ids = cartItems.map(item => item.product.id);

            const params = new URLSearchParams();
            ids.forEach(id => params.append('id', id));
            params.append('pageType', CART);

            const response = await fetch(`
                ${PRODUCTS_API_PATH}?${params.toString()}
            `);
            const { success, data } = await response.json();

            if (!success) {
                return {
                    success: false,
                    message: CHECKOUT_ERROR.STOCK_CHECK_FAILED
                };
            }

            const products = data || [];
        
            if (products.length === 0) {
                return {
                    success: false,
                    message: CHECKOUT_ERROR.NO_PRODUCT_DATA
                };
            }

            const insufficientItems = cartItems.filter(cartItem => {
                const product = data.find((p: Product) => p.id === cartItem.product.id);
                return product && product.stock < cartItem.quantity;
            });

            if (insufficientItems.length > 0) {
                const itemNames = insufficientItems.map(item => item.product.title).join('・');

                return {
                    success: false,
                    message: `${itemNames} ${CHECKOUT_ERROR.UPDATE_STOCK}`
                };
            }

            return { success: true };
        } catch (error) {
            console.error('Hook Error - Stock Availability Error:', error);

            return {
                success: false,
                message: CHECKOUT_ERROR.FAILED_CHECK_STOCK
            };
        }
    };

    // チェックアウト
    const initiateCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            const { 
                success: stockCheckSuccess, 
                message: stockCheckMessage 
            } = await checkStockAvailability();

            if (!stockCheckSuccess) {
                router.refresh();
                
                setTimeout(() => {
                    showErrorToast(stockCheckMessage as string);
                }, CHECKOUT_SHOW_TOAST_DELAY);

                return;
            }

            const response = await fetch(CHECKOUT_API_PATH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartItems })
            });

            const { 
                success: checkoutSuccess, 
                data: checkoutData,
                message: checkoutMessage
            } = await response.json();

            if (checkoutSuccess && checkoutData?.url) {
                router.push(checkoutData.url);
            } else {
                throw new Error(checkoutMessage);
            }
        } catch (error) {
            console.error('Hook Error - Checkout error:', error);
            setError(CHECKOUT_ERROR.NOT_PROCEED_CHECKOUT);
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        initiateCheckout
    }
}

export default useCheckout