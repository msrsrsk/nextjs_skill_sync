import Link from "next/link"
import Image from "next/image"

import ProductTag from "@/components/common/labels/ProductTag"
import StarRating from "@/components/ui/review/StarRating"
import TrendStatus from "@/components/common/labels/TrendStatus"
import ProductPrice from "@/components/ui/product/ProductPrice"
import { calculateAverageRating } from "@/services/review/calculation"
import { 
    NOIMAGE_PRODUCT_IMAGE_URL, 
    STAR_RATING_SIZES_TYPES, 
    STAR_RATING_TYPES,
    SITE_MAP 
} from "@/constants/index"

const { STAR_SMALL } = STAR_RATING_SIZES_TYPES;
const { STAR_MONOCHROME } = STAR_RATING_TYPES;
const { CATEGORY_PATH } = SITE_MAP;

interface ProductCardProps {
    product: ProductWithReviewsAndPricing;
    linksRef: React.RefObject<HTMLAnchorElement>;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    trendStatus?: boolean;
}

const ProductCard = ({ 
    product,
    linksRef, 
    onMouseEnter, 
    onMouseLeave, 
    trendStatus = false 
}: ProductCardProps) => {
    const { 
        title, 
        image_urls, 
        price, 
        category, 
        slug,
        stock,
        product_pricings,
    } = product;

    const { sale_price, sold_count } = product_pricings || {};

    const reviews = 'reviews' in product ? product.reviews : [];

    return (
        <Link 
            ref={linksRef}
            href={`${CATEGORY_PATH}/${category.toLowerCase()}/${slug}`} 
            className="product-list-card"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {trendStatus && (
                <TrendStatus syncNum={sold_count || 0} />
            )}

            {/* 商品画像 */}
            <div className="product-list-imagebox">
                <Image 
                    className="product-list-image" 
                    src={image_urls ? image_urls : NOIMAGE_PRODUCT_IMAGE_URL} 
                    width={600} 
                    height={600} 
                    alt="" 
                />
            </div>

            <div>
                {/* 商品タグ */}
                <div className="product-list-tagbox">
                    <ProductTag category={category} />
                </div>

                {/* 商品タイトル */}
                <h3 className="product-list-title">{title}</h3>

                {/* レビュー評価 */}
                <div className="product-list-ratingbox mb-2">
                    <StarRating 
                        rating={calculateAverageRating(reviews as Review[])} 
                        size={STAR_SMALL} 
                        type={STAR_MONOCHROME} 
                    />
                    <span className="product-list-ratingtext">
                        {calculateAverageRating(reviews as Review[])}
                    </span>
                </div>

                {/* 価格 */}
                <ProductPrice 
                    price={price} 
                    salePrice={sale_price ?? null} 
                    stock={stock}
                />
            </div>
        </Link>
    )
}

export default ProductCard