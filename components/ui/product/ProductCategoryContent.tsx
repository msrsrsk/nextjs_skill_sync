"use client"

import { useState, useRef } from "react"
import { SlidersHorizontal, ArrowUpDown } from "lucide-react"

import NoDataText from "@/components/common/display/NoDataText"
import Pagination from "@/components/ui/navigation/Pagination"
import ProductCard from "@/components/ui/product/ProductCard"
import Pointer from "@/components/ui/display/Pointer"
import TabNavigation from "@/components/common/display/TabNavigation"
import useIsMobile from "@/hooks/layout/useIsMobile"
import useMousePosition from "@/hooks/layout/useMousePosition"
import { useCollectionFilterStore } from "@/app/stores/useStore"
import { useCollectionSortStore } from "@/app/stores/useStore"
import { useFooterVisibility } from "@/hooks/layout/useFooterVisibility"
import { categoryLinks, trendLinks } from "@/data/links"
import { MEDIA_QUERY_CONFIG, PAGINATION_CONFIG } from "@/constants/index"

const { SIZE_LARGE } = MEDIA_QUERY_CONFIG;
const { INITIAL_PAGE } = PAGINATION_CONFIG;

interface ProductCategoryContentProps {
    categoryData: ProductsCategoryData;
    category: ProductCategoryTagType;
    isTrend?: boolean;
}

const ProductCategoryContent = ({ 
    categoryData,
    category,
    isTrend = false
}: ProductCategoryContentProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const linksRef = useRef<HTMLAnchorElement>(null);

    const isMobile = useIsMobile({ mediaQuery: SIZE_LARGE });
    const mousePosition = useMousePosition({ 
        isMobile, 
        linksRef, 
        setIsHovered 
    });

    const isFooterVisible = useFooterVisibility({ offset: -400 });
    const { collectionFilterOpen, setCollectionFilterOpen } = useCollectionFilterStore();
    const { collectionSortOpen, setCollectionSortOpen } = useCollectionSortStore();

    const { 
        products, 
        totalPages, 
        currentPage, 
        hasNextPage, 
        hasPrevPage 
    } = categoryData;

    const links = isTrend ? trendLinks : categoryLinks;

    return <>
        <TabNavigation
            links={links}
            category={category}
        />

        {products.length === 0 ? (
            <NoDataText />
        ) : <>
            <Pointer 
                position={mousePosition} 
                label="More" 
                isHovered={isHovered} 
            />

            <div className="max-w-4xl mx-auto">
                <div className="category-card-list">
                    {products.map((product) => (
                        <div 
                            key={product.id} 
                            className="mx-auto w-full"
                        >
                            <ProductCard 
                                product={product}
                                linksRef={linksRef} 
                                onMouseEnter={() => setIsHovered(true)} 
                                onMouseLeave={() => setIsHovered(false)} 
                                trendStatus={isTrend}
                            />
                        </div>
                    ))}
                </div>

                {totalPages > INITIAL_PAGE && (
                    <Pagination 
                        totalPages={totalPages} 
                        currentPage={currentPage} 
                        hasNextPage={hasNextPage} 
                        hasPrevPage={hasPrevPage} 
                    />
                )}
            </div>
        </>}

        <div className={`fixed bottom-5 md:bottom-10 left-1/2 -translate-x-1/2 p-[10px] md:py-3 md:px-5 flex gap-1 md:gap-4 z-[20] transition-all duration-300 ease-in-out${
            isFooterVisible ? ' opacity-0 invisible' : ' opacity-100 visible'
        }`}>
            <div className="absolute top-0 left-0 w-full h-full grass-bg backdrop-blur-[12px] z-[-1] rounded-sm"></div>
            <button 
                className="filter-button"
                onClick={() => setCollectionFilterOpen(!collectionFilterOpen)}
            >
                <SlidersHorizontal className="w-5 h-5" strokeWidth={2} />
                <span className="filter-button-text">Filter</span>
            </button>
            <button 
                className="filter-button"
                onClick={() => setCollectionSortOpen(!collectionSortOpen)}
            >
                <ArrowUpDown className="w-5 h-5" strokeWidth={2} />
                <span className="filter-button-text">Sort</span>
            </button>
        </div>
    </>
}

export default ProductCategoryContent