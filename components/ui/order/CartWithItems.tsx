"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

import ConfirmModal from "@/components/common/modals/ConfirmModal"
import CartItem from "@/components/ui/order/CartItem"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import useCart from "@/hooks/cart/useCart"
import usePageScrollReset from "@/hooks/layout/usePageScrollReset"
import useCartQuantityManager from "@/hooks/cart/useCartQuantityManager"
import CartSummary from "@/components/ui/order/CartSummary"
import { useCartStore } from "@/app/stores/useStore"
import { showSuccessToast } from "@/components/common/display/Toasts"
import { SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { CATEGORY_PATH } = SITE_MAP;
const { PRODUCT_ERROR } = ERROR_MESSAGES;

interface CartWithItemsProps {
    cartItems: CartItemWithProduct[];
    setCartItems: (items: CartItemWithProduct[]) => void;
}

const CartWithItems = ({
    cartItems,
    setCartItems,
}: CartWithItemsProps) => {
    const [modalActive, setModalActive] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ProductId | null>(null);
    const [cartError, setCartError] = useState<string | null>(null);

    const { cartCount, setCartCount } = useCartStore();

    const {
        loading: cartRemoveLoading,
        error: cartRemoveError,
        success: cartRemoveSuccess,
        removeCart,
    } = useCart();

    const { 
        optimisticQuantities, 
        optimisticCartItems,
        getDisplayQuantity,
        createQuantityUpdater,
    } = useCartQuantityManager({ cartItems });

    const handleConfirmDelete = () => {
        if (selectedItem) removeCart({ productId: selectedItem });
    };

    useEffect(() => {
        if (cartRemoveSuccess) {
            if (!selectedItem) return;

            const itemToRemove = cartItems.find(item => item.product.id === selectedItem);
            if (!itemToRemove) return;

            const removedQuantity = optimisticQuantities[selectedItem] || itemToRemove.quantity;

            setCartItems(cartItems.filter(item => item.product.id !== selectedItem));
            setCartCount(cartCount - removedQuantity);
            setSelectedItem(null);
            setModalActive(false);
            showSuccessToast(PRODUCT_ERROR.REMOVE_SUCCESS);
        }
    }, [cartRemoveSuccess]);

    usePageScrollReset({
        dependencies: [cartError, cartRemoveError],
        condition: !!cartError || !!cartRemoveError
    });

    if (cartError || cartRemoveError) {
        return <div className="mt-8 mb-10">
            <ErrorMessage message={cartError || cartRemoveError as string} />
        </div>
    }

    return <>
        <Link
            href={CATEGORY_PATH}
            className="underline text-sm md:text-base leading-[28px] md:leading-[32px] font-medium flex justify-center mb-8 md:mb-10"
        >
            ショッピングを続ける
        </Link>

        <ul 
            role="list" 
            className="border-t border-b border-foreground max-w-2xl mx-auto"
        >
            {cartItems.map((item, index) => (
                <CartItem 
                    key={item.id}
                    item={item}
                    index={index}
                    cartLoading={cartRemoveLoading}
                    displayQuantity={getDisplayQuantity(item)}
                    setDisplayQuantity={createQuantityUpdater(item)}
                    setModalActive={setModalActive}
                    setSelectedItem={setSelectedItem}
                />
            ))}
        </ul>

        <CartSummary
            cartItems={cartItems}
            optimisticQuantities={optimisticQuantities}
            optimisticCartItems={optimisticCartItems}
            setCartError={setCartError}
        />

        <ConfirmModal 
            text="選択したスキルを削除しますか？"
            modalActive={modalActive}
            setModalActive={setModalActive}
            onConfirm={handleConfirmDelete}
        />
    </>
}

export default CartWithItems