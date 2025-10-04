"use client"

import NoDataText from "@/components/common/display/NoDataText"
import SectionTitle from "@/components/common/display/SectionTitle"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import useSkillTrailIds from "@/hooks/data/useSkillTrailIds"
import useSkillTrailData from "@/hooks/data/useSkillTrailData"
import ProductSliderContainer from "@/components/ui/product/ProductSliderContainer"

const SkillTrailSection = () => {
    return (
        <section className="c-container-with-slider product-section">

            <SectionTitle 
                title="Skill Trail" 
                customClass="mb-6 md:mb-10" 
            />

            <SkillTrailContent />
        </section>
    )
}

const SkillTrailContent = () => {
    const { 
        loading: idsLoading, 
        error: idsError, 
        ids,
    } = useSkillTrailIds();

    const { 
        products,
        loading: dataLoading,
        error: dataError
    } = useSkillTrailData(ids);

    if (idsLoading || dataLoading) return <LoadingSpinner />
    if (!products) return <NoDataText />
    if (idsError || dataError) {
        return <ErrorMessage message={(idsError || dataError) as string} />
    }

    return (
        <ProductSliderContainer 
            products={products as ProductWithReviewsAndPricing[]} 
            totalCount={products?.length || 0}
            isOptimalSyncs={false}
            customClass="mb-5 md:mb-10"
        />
    )
}

export default SkillTrailSection