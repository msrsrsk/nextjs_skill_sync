import { useCallback, useEffect, useState, useMemo } from "react";

const useCartQuantityManager = ({
    cartItems,
}: { cartItems: CartItemWithProduct[] }) => {
    const [optimisticQuantities, setOptimisticQuantities] = useState<Record<ProductId, number>>({});

    // 数量の初期化
    useEffect(() => {
        const initialQuantities: Record<ProductId, number> = {};

        cartItems.forEach(item => {
            initialQuantities[item.product.id] = item.quantity;
        });

        setOptimisticQuantities(initialQuantities);
    }, [cartItems]);

    // カート内商品の楽観的更新
    const optimisticCartItems = useMemo(() => {
        return cartItems.map(item => ({
            ...item,
            quantity: optimisticQuantities[item.product.id] || item.quantity
        }));
    }, [cartItems, optimisticQuantities]);

    // 数量の更新
    const handleQuantityUpdate = useCallback((productId: ProductId, quantity: number) => {
        setOptimisticQuantities(prev => ({
            ...prev,
            [productId]: quantity
        }));
    }, []);

    // 表示用の数量を取得
    const getDisplayQuantity = useCallback((item: CartItemWithProduct) => {
        return optimisticQuantities[item.product.id] || item.quantity;
    }, [optimisticQuantities]);

    // 数量の更新関数
    const createQuantityUpdater = useCallback((item: CartItemWithProduct) => {
        return (quantity: number) => handleQuantityUpdate(item.product.id, quantity);
    }, [handleQuantityUpdate]);

    return {
        optimisticQuantities,
        optimisticCartItems,
        getDisplayQuantity,
        createQuantityUpdater,
    }
}

export default useCartQuantityManager