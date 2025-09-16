import { Metadata } from "next"
import { Suspense } from "react"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import ProductCategoryWrapper from "@/components/ui/product/ProductCategoryWrapper"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import { generatePageMetadata } from "@/lib/metadata/page"
import { formatTitleCase } from "@/lib/utils/format"
import { CATEGORY_SUBTITLES, DEFAULT_PAGE, SITE_MAP } from "@/constants/index"

const { ALL_SUBTITLE } = CATEGORY_SUBTITLES;
const { CATEGORY_PATH } = SITE_MAP;

export const dynamic = "force-dynamic";

export async function generateMetadata({ 
    params 
}: { params: { category: string } }): Promise<Metadata> {
    const category = params.category;

    const categoryTitile = formatTitleCase(category);

    return generatePageMetadata({
        title: `${categoryTitile} Skills`,
        description: `${categoryTitile} Skills の商品一覧ページです。`,
        url: `${CATEGORY_PATH}/${category.toLowerCase()}`,
    });
}

const ProductCategoryPage = ({ 
    params,
    searchParams 
}: CategoryPageProps) => {
    const page = parseInt(searchParams.page || DEFAULT_PAGE);
    const category = params.category;

    const categoryTitile = formatTitleCase(category);

    return <>
        <Breadcrumb />

        <div className="c-container-page">
            <PageTitle 
                title={`${categoryTitile} Skills`}
                customClass="mt-6 mb-2 md:mt-10 md:mb-4" 
            />
            <p className="page-subtitle">{ALL_SUBTITLE}</p>

            <Suspense fallback={<LoadingSpinner />}>
                <ProductCategoryWrapper 
                    page={page} 
                    category={category}
                    categoryTitile={categoryTitile}
                    searchParams={searchParams}
                    isTrend={false}
                />
            </Suspense>
        </div>
    </>
}

export default ProductCategoryPage