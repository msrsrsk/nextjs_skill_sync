import ProductSliderContainer from "@/components/ui/product/ProductSliderContainer"
import NoDataText from "@/components/common/display/NoDataText"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"

const OptimalSyncsSectionContent = ({ productData }: OptimalSyncsProductData) => {
    const { totalCount } = productData;
    
    if (!productData) return <LoadingSpinner />
    if (totalCount === 0) return <NoDataText />

    return (
        <ProductSliderContainer 
            products={productData} 
            totalCount={totalCount}
            isOptimalSyncs={true}
        />
    )
}

export default OptimalSyncsSectionContent