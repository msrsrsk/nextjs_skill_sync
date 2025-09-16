import { Metadata } from "next"
import { Suspense } from "react"

import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import ProductDetails from "@/components/sections/ProductDetails"
import ReviewSectionContent from "@/components/ui/review/ReviewSectionContent"
import OptimalSyncsSection from "@/components/sections/OptimalSyncsSection"
import SkillTrailSection from "@/components/sections/SkillTrailSection"
import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import { getProductBySlugDataForMetadata } from "@/lib/database/prisma/actions/products"
import { getProductBySlug } from "@/lib/services/product/actions"
import { getProductReviews } from "@/lib/services/review/actions"
import { notFound } from "next/navigation"
import { generatePageMetadata } from "@/lib/metadata/page"
import { SITE_MAP } from "@/constants/index"

const { CATEGORY_PATH } = SITE_MAP;

export const dynamic = "force-dynamic";

export async function generateMetadata({ 
    params 
}: { params: { slug: string } }): Promise<Metadata> {
    const product = await getProductBySlugDataForMetadata({ 
        slug: params.slug, 
    });

    if (!product) notFound();

    return generatePageMetadata({
        title: product.title,
        description: product.description,
        url: `${CATEGORY_PATH}/${product.category.toLowerCase()}/${params.slug}`,
    });
}

const ProductDetailPage = ({ params }: { params: { slug: string } }) => {
    const { slug } = params;

    return <>
        <div className="md-lg:hidden mb-2">
            <Breadcrumb />
        </div>

        <Suspense fallback={<LoadingSpinner />}>
            <ProductAndReviewData slug={slug} />
            <SkillTrailSection />
        </Suspense>
    </>
}

const ProductAndReviewData = async ({ slug }: { slug: string }) => {
    const [productResult, reviewsResult] = await Promise.all([
        getProductBySlug({ slug }),
        getProductReviews({ productSlug: slug }),
    ]);
    
    const product = productResult.data?.product;
    if (!product) notFound();

    const { data: productData } = productResult;
    const { data: reviewData, error: reviewError } = reviewsResult;

    return <>
        <ProductDetails 
            slug={slug}
            product={product} 
            productReviewsCount={reviewData?.reviews.length} //個別商品のレビューの合計値
            productReviewStats={productData?.reviewStats} //個別商品のレビューの評価平均値
        />

        <ReviewSectionContent 
            reviewData={reviewData as ReviewResultProps} //個別商品のレビューデータ
            productReviewStats={productData?.reviewStats} //個別商品のレビューの統計データ
            productId={product.id} // 個別商品のID
            hasError={reviewError}
        />

        {!productData?.product.stripe_subscription_price_ids && productData?.optimalSyncs && (
            <OptimalSyncsSection 
                optimalSyncs={productData.optimalSyncs}
            />
        )}
    </>
}

export default ProductDetailPage