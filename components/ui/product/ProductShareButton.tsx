import Link from "next/link"

import { productSocialLinks } from "@/data/links"
import { NOIMAGE_PRODUCT_IMAGE_URL, SITE_MAP } from "@/constants/index"

const { CATEGORY_PATH } = SITE_MAP;

interface ProductShareButtonProps {
    title: ProductTitle;
    imageUrls?: ProductImageUrls;
    category: ProductCategory;
    slug: ProductSlug;
}

const ProductShareButton = ({ 
    title, 
    imageUrls, 
    category, 
    slug 
}: ProductShareButtonProps) => {
    const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${CATEGORY_PATH}/${category.toLowerCase()}/${slug}`;
    const productImage = imageUrls || NOIMAGE_PRODUCT_IMAGE_URL; 

    const shareUrls = {
        X: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}&hashtags=SkillSync`,
        Pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(productImage)}&description=${encodeURIComponent(title)}`,
        Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    };

    return (
        <div className="flex items-center gap-6">
            <p className="text-sm leading-[20px] font-semibold font-poppins">
                Share :
            </p>
            <div className="flex items-center gap-5">
                {productSocialLinks.map((link) => (
                    <Link 
                        href={shareUrls[link.label as keyof typeof shareUrls]} 
                        key={link.label}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <link.icon />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default ProductShareButton