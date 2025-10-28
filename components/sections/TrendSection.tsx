import { Suspense } from "react"

import SectionTitle from "@/components/common/display/SectionTitle"
import TrendSectionContent from "@/components/ui/other/TrendSectionContent"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import { getAllCategoriesProductsSalesVolume } from "@/services/product/actions"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { PRODUCT_ERROR } = ERROR_MESSAGES;

const TrendSection = () => {
    return (
        <section className="c-container-with-slider product-section">

            <SectionTitle 
                title="Trend" 
                customClass="mb-6 md:mb-10" 
            />

            <Suspense fallback={<LoadingSpinner />}>
                <TrendSectionWrapper />
            </Suspense>
        </section>
    )
}

const TrendSectionWrapper = async () => {
    const { success, data } = await getAllCategoriesProductsSalesVolume({});
    // const { success, data, error } = { success: true, data: undefined, error: null };

    const errorMessage = PRODUCT_ERROR.TREND_FETCH_FAILED;

    if (!success) return <ErrorMessage message={errorMessage} />
    if (!data) return <ErrorMessage message={errorMessage} />

    return (
        <TrendSectionContent productData={data} />
    )
}

export default TrendSection