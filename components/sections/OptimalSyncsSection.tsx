import SectionTitle from "@/components/common/display/SectionTitle"
import OptimalSyncsSectionContent from "@/components/ui/other/OptimalSyncsSectionContent"
import { getProductsByIdsData } from "@/lib/database/prisma/actions/products"
import { GET_PRODUCTS_PAGE_TYPES } from "@/constants/index"

const { OPTIMAL_SYNCS } = GET_PRODUCTS_PAGE_TYPES;

interface OptimalSyncsSectionProps {
    optimalSyncs: {
        totalCount: number;
        requiredIds: ProductId[];
        optionIds: ProductId[];
        recommendedIds: ProductId[];
    }
}

const OptimalSyncsSection = async ({  
    optimalSyncs 
}: OptimalSyncsSectionProps) => {
    const { 
        totalCount, 
        requiredIds, 
        optionIds, 
        recommendedIds 
    } = optimalSyncs;

    const [requiredProducts, optionProducts, recommendedProducts] = await Promise.all([
        requiredIds.length > 0 ? getProductsByIdsData({
            ids: requiredIds,
            pageType: OPTIMAL_SYNCS
        }) : null,
        optionIds.length > 0 ? getProductsByIdsData({
            ids: optionIds,
            pageType: OPTIMAL_SYNCS
        }) : null,
        recommendedIds.length > 0 ? getProductsByIdsData({
            ids: recommendedIds,
            pageType: OPTIMAL_SYNCS
        }) : null
    ]);

    const productData = {
        totalCount,
        requiredIds: requiredProducts,
        optionIds: optionProducts,
        recommendedIds: recommendedProducts
    }

    return (
        <section className="c-container-with-slider product-section">

            <SectionTitle 
                title="Optimal Syncs" 
                customClass="mb-6 md:mb-10" 
            />

            <OptimalSyncsSectionContent 
                productData={productData as OptimalSyncsProductIds}
            />
        </section>
    )
}

export default OptimalSyncsSection