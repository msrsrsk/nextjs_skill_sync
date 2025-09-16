import { useState, useEffect, useCallback } from "react"

import { MOUSE_POSITION_CONFIG } from "@/constants/index"

const { INITIAL } = MOUSE_POSITION_CONFIG;

interface UseMouseTrackingProps {
    isMobile: boolean;
    elementRef: React.RefObject<HTMLElement>;
    setIsHovered: (isHovered: boolean) => void;
}

const useMouseTracking = ({ 
    isMobile, 
    elementRef, 
    setIsHovered 
}: UseMouseTrackingProps) => {
    const [mousePosition, setMousePosition] = useState<MousePosition>(INITIAL);

    const mouseMoveListener = useCallback((event: MouseEvent) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    }, []);

    const scrollListener = useCallback(() => {
        if (!elementRef.current) return;
        
        const rect = elementRef.current.getBoundingClientRect();
        const { x: mouseX, y: mouseY } = mousePosition;

        if (mouseX < rect.left || mouseX > rect.right || 
            mouseY < rect.top || mouseY > rect.bottom) {
            setIsHovered(false);
        }
    }, [mousePosition, elementRef]);

    useEffect(() => {
        if (isMobile) return;

        window.addEventListener("mousemove", mouseMoveListener);
        window.addEventListener("scroll", scrollListener);
    
        return () => {
            window.removeEventListener("mousemove", mouseMoveListener);
            window.removeEventListener("scroll", scrollListener);
        };
    }, [isMobile, mouseMoveListener, scrollListener]);

    return { mousePosition, elementRef };
}

export default useMouseTracking