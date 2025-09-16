"use client"

import { useState } from "react"

import ProductQuantityInput from "@/components/ui/product/ProductQuantityInput"
import BookmarkButton from "@/components/ui/bookmark/BookmarkButton"
import ProductPurchaseButton from "@/components/ui/product/ProductPurchaseButton"
import { PRODUCT_QUANTITY_CONFIG } from "@/constants/index"

const { DEFAULT_QUANTITY } = PRODUCT_QUANTITY_CONFIG;

interface ProductPurchaseSectionProps {
    id: ProductId;
    title: ProductTitle;
    image_urls: ProductImageUrls;
    stock: ProductStock;
    isSubscription: boolean;
    subscriptionOptions: SubscriptionOption[];
}

const ProductPurchaseSection = ({
    id,
    title,
    image_urls,
    stock,
    isSubscription,
    subscriptionOptions,
}: ProductPurchaseSectionProps) => {
    const [quantity, setQuantity] = useState<number>(DEFAULT_QUANTITY);

    return <>
        {!isSubscription && (
            <div className="flex items-center flex-wrap gap-x-8 md:gap-x-10 gap-y-3 mb-8">
                {/* 数量セレクタ */}
                <ProductQuantityInput 
                    stock={stock}
                    quantity={quantity}
                    setQuantity={setQuantity}
                />

                {/* お気に入りボタン */}
                <BookmarkButton 
                    productId={id} 
                />
            </div>
        )}

        {/* 購入ボタン */}
        <ProductPurchaseButton 
            productId={id}
            title={title} 
            imageUrls={image_urls} 
            stock={stock} 
            isSubscription={isSubscription}
            isInvalid={isSubscription && subscriptionOptions.length === 0}
            quantity={quantity}
        />
    </>
}

export default ProductPurchaseSection