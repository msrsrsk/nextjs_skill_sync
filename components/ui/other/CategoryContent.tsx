import CategoryCard from "@/components/ui/other/CategoryCard"
import { categorySectionLinks } from "@/data/links"

const CategoryContent = () => {
    return (
        <div className="max-w-4xl mx-auto relative">
            <div 
                className="grid sm:grid-cols-2 lg-xl:grid-cols-[34.75%_25%_34.75%] lg-xl:grid-rows-[284px_284px] gap-4 lg-xl:gap-x-[33px] lg-xl:gap-y-[32px]" 
                style={{perspective: "1000px"}}
            >
                {categorySectionLinks.map(({
                    title, 
                    subtitle, 
                    href, 
                    image, 
                    image2, 
                    imageBoxClassName, 
                    imageBoxClassName2
                }, index) => (
                    <CategoryCard 
                        key={title} 
                        title={title} 
                        subtitle={subtitle} 
                        href={href} 
                        image={image} 
                        image2={image2} 
                        imageBoxClassName={imageBoxClassName} 
                        imageBoxClassName2={imageBoxClassName2} 
                        index={index}
                    />
                ))}
            </div>
        </div>
    )
}

export default CategoryContent