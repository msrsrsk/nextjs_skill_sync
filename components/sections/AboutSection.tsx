import SectionTitle from "@/components/common/display/SectionTitle"
import GridBackground from "@/components/ui/aceternity/GridBackground"

const AboutSection = () => {
    return (
        <section className="c-container-no-vertical-padding">
            <div className="max-w-4xl mx-auto">
                <GridBackground customClass="relative">
                    <SectionTitle 
                        title="About" 
                        customClass="mb-8" 
                    />
                    
                    <div className="text-center">
                        <h3 className="text-lg md:text-2xl leading-none font-bold mb-4 md:mb-6">
                            スキルをシェアする時代へ
                        </h3>
                        <p className="text-sm md:text-lg leading-[28px] md:leading-[40px] font-medium font-zen">
                            SKILL SYNCは、<br className="md:hidden" />
                            “スキル”という新しい価値を販売・装備する<br className="md:hidden" />
                            未来型のマーケットプレイスです。<br />
                            あなたの記憶に、新しい技術を。<br className="md:hidden" />
                            学ぶ時代から、装備する時代へ。<br />
                            今すぐスキルを選んで現実のクエストに挑もう！
                        </p>
                    </div>
                </GridBackground>
            </div>
        </section>
    )
}

export default AboutSection