import useMouseTracking from "@/hooks/layout/useMouseTracking"

interface UseMousePositionProps {
    isMobile: boolean;
    linksRef: React.RefObject<HTMLAnchorElement>;
    setIsHovered: (isHovered: boolean) => void;
}

const useMousePosition = ({ 
    isMobile, 
    linksRef, 
    setIsHovered 
}: UseMousePositionProps) => {
    const { mousePosition } = useMouseTracking({ 
        isMobile, 
        elementRef: linksRef, 
        setIsHovered 
    });

    return mousePosition;
}

export default useMousePosition