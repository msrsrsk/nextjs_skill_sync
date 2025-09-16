import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"

import LoadingSpinner from "@/components/common/display/LoadingSpinner"
import ErrorMessage from "@/components/common/display/ErrorMessage"
import { getProductsByIdsData } from "@/lib/database/prisma/actions/products"
import { 
    NOIMAGE_PRODUCT_IMAGE_URL, 
    GET_PRODUCTS_PAGE_TYPES, 
    ERROR_MESSAGE_POSITIONS,
    SITE_MAP 
} from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SYNC_CONDITIONS } = GET_PRODUCTS_PAGE_TYPES;
const { ERROR_LEFT } = ERROR_MESSAGE_POSITIONS;
const { CATEGORY_PATH } = SITE_MAP;
const { PRODUCT_ERROR } = ERROR_MESSAGES;

interface ProductSyncConditionsProps {
    optimalSyncsArray: string[];
}

const ProductSyncConditions = async ({ optimalSyncsArray }: ProductSyncConditionsProps) => {
    const productsResult = await getProductsByIdsData({
        ids: optimalSyncsArray,
        pageType: SYNC_CONDITIONS
    });

    if (!productsResult) {
        return <ErrorMessage 
            message={PRODUCT_ERROR.IDS_FETCH_FAILED} 
            position={ERROR_LEFT} 
        />
    }

    return (
        <div className="product-info-box">
            <div className="product-subtitle">
                <h3 className="product-info-title">Sync Conditions</h3>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
                {productsResult && (
                    <div className="flex gap-[18px] flex-wrap">
                        {productsResult.map((product) => {
                            const { id, title, image_urls, category, slug } = product;
                            const imageUrl = image_urls || NOIMAGE_PRODUCT_IMAGE_URL;

                            const titleWithoutSkill = title.replace(/ SKILL$/i, '');

                            return (
                                <Link 
                                    key={id}
                                    href={`${CATEGORY_PATH}/${category.toLowerCase()}/${slug}`}
                                    className="w-[100px] block"
                                >
                                    <Image 
                                        src={imageUrl} 
                                        alt=""
                                        width={80} 
                                        height={80} 
                                        className="mx-auto mb-2"
                                    />
                                    <p className="text-xs font-medium font-poppins leading-[18px] uppercase">
                                        {titleWithoutSkill}
                                    </p>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </Suspense>
        </div>
    )
}

export default ProductSyncConditions