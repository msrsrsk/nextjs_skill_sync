import { Suspense } from "react"
import { Metadata } from "next"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import PageTitle from "@/components/common/display/PageTitle"
import ProductCategoryWrapper from "@/components/ui/product/ProductCategoryWrapper"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import { generatePageMetadata } from "@/lib/metadata/page"
import { formatTitleCase } from "@/lib/utils/format"
import { DEFAULT_PAGE, SITE_MAP } from "@/constants/index"

const { TREND_PATH } = SITE_MAP;

export async function generateMetadata({ 
    params 
}: { params: { category: string } }): Promise<Metadata> {
    const category = params.category;

    return generatePageMetadata({
        title: 'トレンド商品一覧',
        description: 'トレンド商品の一覧ページです。月間100万個以上の購入があるトレンド商品が掲載されます。',
        url: `${TREND_PATH}/${category.toLowerCase()}`,
    });
}

const TrendCategoryPage = ({ 
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
                title="Trend"
                customClass="mt-6 mb-2 md:mt-10 md:mb-4" 
            />
            <p className="page-subtitle">
                世界で人気のトレンドを装備する
            </p>

            <Suspense fallback={<LoadingSpinner />}>
                <ProductCategoryWrapper 
                    page={page} 
                    category={category}
                    categoryTitile={categoryTitile}
                    searchParams={searchParams}
                    isTrend={true}
                />
            </Suspense>
        </div>
    </>
}

export default TrendCategoryPage