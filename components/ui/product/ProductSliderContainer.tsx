"use client"

import Slider from "react-slick"
import { useState, useRef } from "react"

import ProductCard from "@/components/ui/product/ProductCard"
import Pointer from "@/components/ui/display/Pointer"
import OptimalSyncsCard from "@/components/ui/other/OptimalSyncsCard"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import useIsMobile from "@/hooks/layout/useIsMobile"
import useMousePosition from "@/hooks/layout/useMousePosition"
import useSliderValidation from "@/hooks/validation/useSliderValidation"
import useSliderDragDetection from "@/hooks/layout/useSliderDragDetection"
import { productSliderSettings, optimalSyncsSliderSettings } from "@/lib/config/sliderOptions"
import { LinkButtonPrimary } from "@/components/common/buttons/Button"
import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { MEDIA_QUERY_CONFIG, OPTIMAL_SYNC_TAG_TYPES } from "@/constants/index"

const { SIZE_LARGE } = MEDIA_QUERY_CONFIG;
const { REQUIRED_TAG, OPTION_TAG, PICKUP_TAG } = OPTIMAL_SYNC_TAG_TYPES;

type ProductSliderContainerProps<T extends boolean> = {
    products: T extends true ? OptimalSyncsProductIds : ProductWithReviews[];
    totalCount: number;
    buttonLink?: string;
    isOptimalSyncs: T;
    customClass?: string;
}

const ProductSliderContainer = <T extends boolean = false>({
    products,
    totalCount,
    buttonLink,
    isOptimalSyncs = false as T,
    customClass
}: ProductSliderContainerProps<T>) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const linksRef = useRef<HTMLAnchorElement>(null);

    const { 
        isSliderInitialized, 
        isSliderValid 
    } = useSliderValidation(
        isOptimalSyncs ? optimalSyncsSliderSettings : productSliderSettings, 
        totalCount
    );

    const isMobile = useIsMobile({ mediaQuery: SIZE_LARGE });
    const mousePosition = useMousePosition({ isMobile, linksRef, setIsHovered });
    const { 
        isDragging, 
        handleDragStart, 
        handleDragEnd 
    } = useSliderDragDetection();

    if (!isSliderInitialized) return <LoadingSpinner />

    const renderProductCards = () => (products as ProductWithReviews[])?.map((product) => (
        <div key={product.id}>
            <ProductCard 
                product={product}
                linksRef={linksRef} 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                trendStatus={true} 
            />
        </div>
    ));

    const renderOptimalSyncCards = (
        products: Product[], 
        tagType: OptimalSyncTagType,
        linksRef: React.RefObject<HTMLAnchorElement>,
        setIsHovered: (isHovered: boolean) => void
    ) => {
        if (!products || products.length === 0) return null;
    
        return products.map((product) => (
            <div key={product.id}>
                <OptimalSyncsCard 
                    product={product}
                    tagType={tagType}
                    linksRef={linksRef} 
                    setIsHovered={setIsHovered} 
                />
            </div>
        ));
    };

    const renderAllOptimalSyncCards = (
        products: OptimalSyncsProductIds,
        linksRef: React.RefObject<HTMLAnchorElement>,
        setIsHovered: (isHovered: boolean) => void
    ) => {
        const { requiredIds, optionIds, recommendedIds } = products;
    
        const allCards = [
            ...(renderOptimalSyncCards(
                requiredIds, 
                REQUIRED_TAG, 
                linksRef, 
                setIsHovered
            ) || []),
            ...(renderOptimalSyncCards(
                optionIds, 
                OPTION_TAG, 
                linksRef, 
                setIsHovered
            ) || []),
            ...(renderOptimalSyncCards(
                recommendedIds, 
                PICKUP_TAG, 
                linksRef, 
                setIsHovered
            ) || [])
        ];
    
        return allCards.map((card, index) => (
            <div key={index}>
                {card}
            </div>
        ));
    }

    return (
        <div className={`slider-product-container w-[100vw]${
            !isSliderValid ? ' px-5 md:px-20' : ''
        }${
            customClass ? ` ${customClass}` : ''
        }`}
        >
            <Pointer 
                position={mousePosition} 
                label="More" 
                isHovered={isHovered && !isDragging}
            />
    
            {!isSliderValid ? (
                <div className="max-w-4xl mx-auto">
                    <div className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl-2xl:grid-cols-5 gap-[10px]${isOptimalSyncs ? ' xl:gap-5' : ' xl:gap-10'}`}>
                        {isOptimalSyncs ? renderAllOptimalSyncCards(
                            products as OptimalSyncsProductIds, 
                            linksRef, 
                            setIsHovered
                        ) : renderProductCards()}
                    </div>
                </div>
            ) : (
                <div 
                    onMouseDown={handleDragStart}
                    onMouseLeave={handleDragEnd}
                    onMouseUp={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchEnd={handleDragEnd}
                >
                    <Slider {...(isOptimalSyncs ? optimalSyncsSliderSettings : productSliderSettings)}>
                        {isOptimalSyncs ? renderAllOptimalSyncCards(
                            products as OptimalSyncsProductIds, 
                            linksRef, 
                            setIsHovered
                        ) : renderProductCards()}
                    </Slider>
                </div>
            )}

            {buttonLink && totalCount > 0 && (
                <LinkButtonPrimary
                    link={buttonLink}
                    customClass="button-space-default uppercase"
                    ariaLabel="商品一覧を見る"
                >
                    <span aria-hidden="true">More</span>
                    <MoreIcon />
                </LinkButtonPrimary>
            )}
        </div>
    )
}

export default ProductSliderContainer