"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"

import TabSwitcher from "@/components/common/display/TabSwitcher"
import ProductSliderContainer from "@/components/ui/product/ProductSliderContainer"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import FadeInUpContainer from "@/components/common/display/FadeInUpContainer"
import NoDataText from "@/components/common/display/NoDataText"
import { TREND_CATEGORIES, SITE_MAP } from "@/constants/index"

const { ACTIVE } = TREND_CATEGORIES;
const { TREND_PATH } = SITE_MAP;

interface TrendCategoryData {
    category: string;
    products: ProductWithReviews[];
    totalCount: number;
}

interface TrendSectionInnerProps {
    categoryData: TrendCategoryData;
}

const TrendSectionContent = ({ productData }: TrendSectionContentProps) => {
    const [activeTab, setActiveTab] = useState(ACTIVE);

    if (productData.length === 0) return <NoDataText />

    return <>
        <TabSwitcher
            categories={TREND_CATEGORIES}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            customClass="mb-10 justify-start sm:justify-center pr-5 sm:pr-0"
        />

        <AnimatePresence mode="wait">
            {productData.map((categoryData) => (
                categoryData.category === activeTab && (
                    <FadeInUpContainer 
                        key={categoryData.category}
                        animationKey={activeTab}
                    >
                        <TrendSectionInner
                            key={categoryData.category}
                            categoryData={categoryData}
                        />
                    </FadeInUpContainer>
                )
            ))}
        </AnimatePresence>
    </>
}

const TrendSectionInner = ({ categoryData }: TrendSectionInnerProps) => {
    const { category, products, totalCount } = categoryData;

    if (!categoryData) return <LoadingSpinner />
    if (totalCount === 0) return <NoDataText />

    return (
        <ProductSliderContainer 
            products={products as ProductWithReviews[]} 
            totalCount={totalCount}
            buttonLink={`${TREND_PATH}/${category.toLowerCase()}`}
            isOptimalSyncs={false}
        />
    )
}

export default TrendSectionContent