import { useState, useRef, useCallback } from "react"

import useIsMobile from "@/hooks/layout/useIsMobile"
import useMouseTracking from "@/hooks/layout/useMouseTracking"
import { MEDIA_QUERY_CONFIG } from "@/constants/index"

const { SIZE_LARGE } = MEDIA_QUERY_CONFIG;

interface UseProductCardHoverProps {
    mediaQuery?: number;
}

const useProductCardHover = ({ mediaQuery = SIZE_LARGE }: UseProductCardHoverProps = {}) => {
    const [isHovered, setIsHovered] = useState(false);

    const linksRef = useRef<HTMLAnchorElement>(null);
    const isMobile = useIsMobile({ mediaQuery });

    const { mousePosition, elementRef } = useMouseTracking({ 
        isMobile, 
        elementRef: linksRef, 
        setIsHovered 
    });

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    return {
        isHovered,
        mousePosition,
        linksRef: elementRef,
        handleMouseEnter,
        handleMouseLeave
    }
}

export default useProductCardHover