import { useState, useEffect, useCallback } from "react"

const useSliderControl = (
    breakpoint: number
) => {
    const [shouldRenderSlider, setShouldRenderSlider] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const checkBreakpoint = useCallback(() => {
        setShouldRenderSlider(window.innerWidth < breakpoint);
    }, [breakpoint])

    useEffect(() => {
        setIsMounted(true);
        checkBreakpoint();

        window.addEventListener('resize', checkBreakpoint);

        return () => {
            window.removeEventListener('resize', checkBreakpoint);
        };
    }, [checkBreakpoint]);

    return isMounted ? shouldRenderSlider : false;
}

export default useSliderControl