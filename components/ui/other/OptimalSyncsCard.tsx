import Link from "next/link"
import Image from "next/image"

import StatusBudge from "@/components/common/labels/StatusBudge"
import { SITE_MAP, NOIMAGE_PRODUCT_IMAGE_URL } from "@/constants/index"

const { CATEGORY_PATH } = SITE_MAP;

interface OptimalSyncsCardProps {
    product: Product;
    linksRef: React.RefObject<HTMLAnchorElement>;
    setIsHovered: (isHovered: boolean) => void;
    tagType: OptimalSyncTagType;
}

const OptimalSyncsCard = ({ 
    product,
    tagType,
    linksRef, 
    setIsHovered, 
}: OptimalSyncsCardProps) => {
    const { 
        title, 
        image_urls, 
        category, 
        slug, 
        optimal_syncs_text 
    } = product;

    return (
        <Link 
            ref={linksRef}
            href={`${CATEGORY_PATH}/${category.toLowerCase()}/${slug}`} 
            className="optimal-syncs-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="optimal-syncs-imagebox">
                <Image 
                    className="optimal-syncs-image" 
                    src={image_urls || NOIMAGE_PRODUCT_IMAGE_URL} 
                    alt="" 
                    width={600} 
                    height={600} 
                />
            </div>
            <div className="grass-bg pt-5 px-6 pb-6 md:pt-6 md:px-8 md:pb-7 rounded-sm md:rounded-md">
                <h3 className="product-list-title">
                    {title}
                </h3>
                <div className="mb-4">
                    <StatusBudge status={tagType} />
                </div>
                <p className="text-sm font-medium leading-[24px] md:leading-[28px]">
                    {optimal_syncs_text}
                </p>
            </div>
        </Link>
    )
}

export default OptimalSyncsCard