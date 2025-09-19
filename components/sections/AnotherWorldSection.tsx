"use client"

import SectionTitle from "@/components/common/display/SectionTitle"
import AnotherWorldContent from "@/components/ui/other/AnotherWorldContent"
import GridBackground from "@/components/ui/aceternity/GridBackground"

const AnotherWorldSection = () => {
    return (
        <section 
            id="another-world" 
            className="c-container-side-only another-world-section relative"
        >
            <div className="relative z-10">
                <div className="mr-5 lg:mr-0">
                    <SectionTitle 
                        title="Another World" 
                        customClass="mb-8 leading-[-0.5px] sm:leading-[0.04em]" 
                    />
                    <p className="another-world-description">
                        3Dモデルをカスタマイズして遊ぶ
                    </p>
                </div>

                <AnotherWorldContent />
            </div>
            <GridBackground 
                customClass="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]" 
                height="h-[418px] md:h-[640px]" 
            />
        </section>
    )
}

export default AnotherWorldSection