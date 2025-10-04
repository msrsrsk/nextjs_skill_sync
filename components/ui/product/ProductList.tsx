"use client"

import { RefObject } from "react"

import ProductCard from "@/components/ui/product/ProductCard"
import Pointer from "@/components/ui/display/Pointer"
import useProductCardHover from "@/hooks/layout/useProductCardHover"

interface ProductListProps {
    products: ProductWithReviewsAndPricing[];
    limit?: number;
}

const ProductList = ({ products, limit = 0 }: ProductListProps) => {
    const { 
        isHovered, 
        mousePosition, 
        linksRef, 
        handleMouseEnter, 
        handleMouseLeave 
    } = useProductCardHover();

    const displayProducts = limit > 0 
        ? products.slice(0, limit) 
        : products;

    return <>
        <Pointer 
            position={mousePosition} 
            label="More" 
            isHovered={isHovered} 
        />

        <div className="category-card-list">
            {displayProducts.map((product) => (
                <div key={product.id} className="mx-auto w-full">
                    <ProductCard 
                        product={product}
                        linksRef={linksRef as RefObject<HTMLAnchorElement>} 
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        trendStatus={true} 
                    />
                </div>
            ))}
        </div>
    </>
}

export default ProductList