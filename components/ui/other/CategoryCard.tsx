import Link from "next/link"
import Image from "next/image"

import { CardContainer } from "@/components/ui/aceternity/3dCard"

interface CategoryCardProps {
    title: string
    subtitle: string
    href: string
    image: string
    image2?: string
    imageBoxClassName: string
    imageBoxClassName2?: string
    index: number
}

const CategoryCard = ({
    title, 
    subtitle, 
    href, 
    image, 
    image2, 
    imageBoxClassName, 
    imageBoxClassName2, 
    index
}: CategoryCardProps) => {
    return (
        <CardContainer 
            key={title} 
            className={`category-card${
                index === 0 ? " lg-xl:[grid-row:1/2] lg-xl:[grid-column:1/2]" : ''}${
                index === 1 ? " lg-xl:[grid-row:2/3] lg-xl:[grid-column:1/2]" : ''}${
                index === 2 ? " lg-xl:[grid-row:1/3] lg-xl:[grid-column:2/3]" : ''}${
                index === 3 ? " lg-xl:[grid-row:1/2] lg-xl:[grid-column:3/4]" : ''}${
                index === 4 ? " lg-xl:[grid-row:2/3] lg-xl:[grid-column:3/4]" : ''
            }`}
        >
            <Link 
                href={href} 
                className="block w-full h-full"
                aria-label={`「${title}」の商品一覧を見る`}
            >
                <div className={`absolute ${imageBoxClassName}`}>
                    <Image 
                        src={image} 
                        alt=""
                        width={280}
                        height={280}
                        className="category-image"
                    />
                </div>
                {image2 && (
                    <div className={
                        `hidden lg-xl:block absolute ${imageBoxClassName2}
                    `}>
                        <Image 
                            src={image2} 
                            alt=""
                            width={280}
                            height={280}
                            className="category-image"
                        />
                    </div>
                )}
                <div className="absolute bottom-4 left-4 md-lg:bottom-[27px] md-lg:left-7">
                    <h3 className="category-title uppercase mb-[6px] md:mb-[10px] [text-shadow:0_0_8px_white]">
                        {title}
                    </h3>
                    <p className="category-subtitle [text-shadow:0_0_8px_white]">
                        {subtitle}
                    </p>
                </div>
            </Link>
        </CardContainer>
    )
}

export default CategoryCard