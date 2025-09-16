import { Metadata } from "next"

import HeroSection from "@/components/sections/HeroSection"
import AboutSection from "@/components/sections/AboutSection"
import TrendSection from "@/components/sections/TrendSection"
import CategorySection from "@/components/sections/CategorySection"
import SyncLogSection from "@/components/sections/SyncLogSection"
import AnotherWorldSection from "@/components/sections/AnotherWorldSection"
import ReviewSection from "@/components/sections/ReviewSection"
import { generatePageMetadata } from "@/lib/metadata/page"
import { MAIN_METADATA } from "@/constants/metadata/main"

export const metadata: Metadata = generatePageMetadata({
    ...MAIN_METADATA.HOME
})

export default function Home() {
    return (
        <>
            <HeroSection />
            <AboutSection />
            <TrendSection />
            <CategorySection />
            <SyncLogSection />
            <ReviewSection />
            <AnotherWorldSection />
        </>
    );
}