"use client"

import Link from "next/link"
import Image from "next/image"
import Slider from "react-slick"
import { useRef, useState } from "react"

import Pointer from "@/components/ui/display/Pointer"
import useIsMobile from "@/hooks/layout/useIsMobile"
import useMousePosition from "@/hooks/layout/useMousePosition"
import useSliderControl from "@/hooks/layout/useSliderControl"
import { anotherWorldLinks } from "@/data/links"
import { anotherWorldSliderSettings } from "@/lib/config/sliderOptions"
import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { MEDIA_QUERY_CONFIG } from "@/constants/index"

const { SIZE_LARGE_MEDIUM, SIZE_LARGE } = MEDIA_QUERY_CONFIG;

interface AnotherWorldLink {
    image: string;
    label: string;
    href: string;
}

const AnotherWorldContent = () => {
    const [isHovered, setIsHovered] = useState(false);

    const linksRef = useRef<HTMLAnchorElement>(null);

    const isMobile = useIsMobile({ mediaQuery: SIZE_LARGE });
    const shouldRenderSlider = useSliderControl(SIZE_LARGE_MEDIUM);
    const mousePosition = useMousePosition({ 
        isMobile, 
        linksRef, setIsHovered 
    });

    const renderLink = (link: AnotherWorldLink) => (
        <Link 
            key={link.label}
            ref={linksRef}
            className="another-world-link" 
            href={link.href} 
            target="_blank" 
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`「${link.label}」のサイトを開く`}
        >
            <Image 
                className="another-world-image" 
                src={link.image} 
                alt="" 
                width={600} 
                height={600} 
            />
            <div className="another-world-linkinner">
                <h3 
                    className="another-world-linktext"
                    aria-hidden="true"
                >
                    {link.label}
                </h3>
                <span className="another-world-iconbox">
                    <MoreIcon color="#222222" />
                </span>
            </div>
        </Link>
    );

    return (
        <div className="w-full overflow-hidden">
            <Pointer 
                position={mousePosition} 
                label="Config" 
                isHovered={isHovered} 
            />

            {shouldRenderSlider ? (
                <Slider {...anotherWorldSliderSettings}>
                    {anotherWorldLinks.map(renderLink)}
                </Slider>
            ) : (
                <div className="grid grid-cols-3 gap-10 justify-center max-w-[880px] mx-auto">
                    {anotherWorldLinks.map(renderLink)}
                </div>
            )}
        </div>
    )
}

export default AnotherWorldContent