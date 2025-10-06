import Image from "next/image"

import TrendStatus from "@/components/common/labels/TrendStatus"
import StarRating from "@/components/ui/review/StarRating"
import Breadcrumb from "@/components/ui/navigation/Breadcrumb"
import ProductTag from "@/components/common/labels/ProductTag"
import ProductPrice from "@/components/ui/product/ProductPrice"
import ProductSubscriptionPrice from "@/components/ui/product/ProductSubscriptionPrice"
import ProductShareButton from "@/components/ui/product/ProductShareButton"
import ProductInfo from "@/components/ui/product/ProductInfo"
import BookmarkButton from "@/components/ui/bookmark/BookmarkButton"
import SkillTrailTracker from "@/components/ui/other/SkillTrailTracker"
import ProductSubscriptionContent from "@/components/ui/product/ProductSubscriptionContent"
import ProductPurchaseSection from "@/components/sections/ProductPurchaseSection"
import { extractSubscriptionPrices } from "@/services/subscription-payment/extractors"
import { 
    NOIMAGE_PRODUCT_IMAGE_URL, 
    TREND_STATUS_SIZES, 
    PRODUCT_PRICE_TYPES,
    STAR_RATING_TYPES
} from "@/constants/index"

const { TREND_STATUS_LARGE } = TREND_STATUS_SIZES;
const { PRICE_DETAIL } = PRODUCT_PRICE_TYPES;
const { STAR_MONOCHROME } = STAR_RATING_TYPES;

interface ProductDetailsProps extends ReviewStats {
    slug: ProductSlug;
    product: ProductWithRelationsAndDetails;
    productReviewsCount?: number;
}

const ProductDetails = ({ 
    slug,
    product, 
    productReviewsCount,
    productReviewStats
}: ProductDetailsProps) => {
    const { 
        id,
        title, 
        description, 
        image_urls, 
        price, 
        category, 
        skill_type, 
        stock,
        product_pricings,
        product_stripes,
    } = product;

    const { sold_count, sale_price } = product_pricings || {};

    const isSubscription = !!product_stripes?.subscription_price_ids;
    const subscriptionOptions = extractSubscriptionPrices(
        product_stripes?.subscription_price_ids ?? null
    )

    return (
        <div className="mx-auto px-5 md:px-20 md-lg:px-0 pb-10 md:pb-0 md-lg:pt-[60px] md-lg:min-h-screen">
            <div className="flex flex-col md-lg:flex-row gap-6 md-lg:gap-[57px] md-lg:mb-[20px] md-lg:items-start">
                <SkillTrailTracker productId={id} />

                {/* 商品画像 */}
                <div className="relative bg-grass rounded-sm md:rounded-2xl md-lg:rounded-s-[0px] md-lg:rounded-r-2xl border border-white md-lg:w-[50%] place-items-center p-[38px] md:p-[56px] md-lg:pr-0 md-lg:pb-[64px] xl:pl-20">
                    <TrendStatus 
                        syncNum={sold_count || 0} 
                        size={TREND_STATUS_LARGE} 
                    />
                    <Image 
                        src={image_urls || NOIMAGE_PRODUCT_IMAGE_URL} 
                        alt="" 
                        width={480} 
                        height={480} 
                        className="m-auto drop-shadow-main-sp md-lg:drop-shadow-main-pc transform-gpu"
                    />

                    {/* 商品情報 */}
                    <div className="hidden md-lg:block w-full">
                        <ProductInfo product={product} />
                    </div>
                </div>

                {/* 商品詳細 */}
                <div className={`md-lg:mt-8 md-lg:w-[50%] lg-xl:w-[calc(50%-180px)] md-lg:max-w-[720px] md-lg:pr-20${!isSubscription ? ' 2xl:sticky 2xl:top-[calc(var(--header-height))]' : ''}`}>

                    {/* パンくずリスト */}
                    <div className="hidden md-lg:block mb-6">
                        <Breadcrumb isProductDetail />
                    </div>

                    {/* 商品タグ */}
                    <div className="mb-3 md:mb-4">
                        <ProductTag category={category} />
                    </div>

                    {/* 商品タイトル */}
                    <h2 className="text-2xl md:text-[32px] leading-8 md:leading-[40px] font-bold font-poppins">
                        {title}
                    </h2>
                    <p className="text-base leading-7 font-medium mb-5">
                        {skill_type}
                    </p>

                    {/* 価格 */}
                    {isSubscription ? (
                        <ProductSubscriptionPrice 
                            price={price} 
                            salePrice={sale_price ?? null} 
                            stock={stock}
                        />
                    ) : (
                        <ProductPrice 
                            price={price} 
                            salePrice={sale_price ?? null} 
                            type={PRICE_DETAIL}
                            stock={stock}
                        />
                    )}

                    {/* レビュー評価 */}
                    {productReviewStats && (
                        <div className="product-list-ratingbox mb-5">
                            <StarRating 
                                rating={productReviewStats.averageRating} 
                                type={STAR_MONOCHROME} 
                            />
                            <span 
                                className="text-base font-poppins font-bold leading-none ml-1"
                            >
                                {productReviewsCount}
                            </span>
                        </div>
                    )}

                    {/* 商品説明 */}
                    <p className="text-base leading-8 font-medium mb-6 tracking-[0px]">
                        {description}
                    </p>

                    {isSubscription && (
                        <ProductSubscriptionContent 
                            product={product}
                            subscriptionOptions={subscriptionOptions as SubscriptionOption[]}
                        />
                    )}

                    {/* 数量セレクタ & お気に入りボタン & 購入ボタン */}
                    <ProductPurchaseSection 
                        id={id}
                        title={title}
                        image_urls={image_urls}
                        stock={stock}
                        isSubscription={isSubscription}
                        subscriptionOptions={subscriptionOptions as SubscriptionOption[]}
                    />

                    <div className="flex items-center flex-wrap justify-between mb-[56px] md-lg:mb-0">
                        {/* シェアボタン */}
                        <ProductShareButton 
                            title={title} 
                            imageUrls={image_urls} 
                            category={category}
                            slug={slug} 
                        />

                        {/* お気に入りボタン */}
                        {isSubscription && (
                            <BookmarkButton productId={id} />
                        )}
                    </div>

                    {/* 商品情報 */}
                    <div className="md-lg:hidden w-full">
                        <ProductInfo product={product} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails