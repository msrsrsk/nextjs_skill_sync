import Image from "next/image"

import { TextGenerateEffect } from "@/components/ui/aceternity/TextGenerateEffect"
import { WavyBackground } from "@/components/ui/aceternity/WavyBackground"
import { SITE_MAP } from "@/constants/index"

const { IMAGE_PATH } = SITE_MAP;

const HeroSection = () => {
    return (
        <section className="relative py-6 md:py-20 overflow-hidden">
            <WavyBackground 
                backgroundFill="#F0F0F0"
                colors={["#93c9cb", "#95ccc3", "#98d0b4"]}
                className="w-full"
            >
                <div className="relative min-h-[310px] md:min-h-[330px]">
                    <TextGenerateEffect 
                        className="hero-text__common" 
                        duration={1.2} 
                        words="What's Skill Sync?" 
                    />
                    <div className="w-full text-center grid place-items-center">
                        <Image 
                            className="hero-image" 
                            src={`${IMAGE_PATH}/hero-img.png`} 
                            alt="" 
                            width={277} 
                            height={277} 
                            priority={true} 
                        />
                    </div>
                </div>
            </WavyBackground>
        </section>
    )
}

export default HeroSection