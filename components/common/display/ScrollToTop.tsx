"use client"

import { useState, useEffect } from "react"

import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { SCROLL_TOP_CONFIG } from "@/constants/index"

const { THRESHOLD_TOP, SCROLL_TOP_THRESHOLD } = SCROLL_TOP_CONFIG;

interface ScrollToTopProps {
    threshold?: number;
}

const ScrollToTop = ({ 
    threshold = SCROLL_TOP_THRESHOLD 
}: ScrollToTopProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > threshold);
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({
            top: THRESHOLD_TOP,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`scroll-top${
                isVisible ? ' opacity-100' : ' opacity-0'
            }`}
            aria-label="トップへ戻る"
        >
            <span className="w-3 h-3">
                <MoreIcon color="#222222" customClass="-rotate-45" />
            </span>
            <span 
                className="scroll-top-text" 
                aria-hidden="true"
            >
                Top
            </span>
        </button>
    );
};

export default ScrollToTop;