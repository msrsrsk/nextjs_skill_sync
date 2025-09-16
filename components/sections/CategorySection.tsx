import SectionTitle from "@/components/common/display/SectionTitle"
import CategoryContent from "@/components/ui/other/CategoryContent"

const CategorySection = () => {
    return (
        <section className="category-bg">
            <div className="c-container relative">
                <SectionTitle 
                    title="Category" 
                    customClass="mb-8 md:mb-10 pointer-events-none" 
                />
                <CategoryContent />
            </div>
        </section>
    )
}

export default CategorySection