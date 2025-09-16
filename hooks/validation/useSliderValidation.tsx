import { useState, useEffect, useCallback } from "react"
import { SlickSettings } from "slick-carousel"

const useSliderValidation = (
    options: SlickSettings, 
    totalSlides: number, 
    offset: number = 0
) => {
    const [isSliderInitialized, setIsSliderInitialized] = useState(false); 
    const [isSliderValid, setIsSliderValid] = useState(false);

    const getCurrentSlidesPerView = useCallback(() => {
        const width = window.innerWidth;

        if (!options.responsive?.length) {
            return options.slidesToShow;
        }

        const currentSetting = options.responsive
            .sort((a, b) => b.breakpoint - a.breakpoint)
            .find(setting => width <= setting.breakpoint);
        
        if (currentSetting && currentSetting.settings !== 'unslick') {
            return currentSetting?.settings.slidesToShow ?? options.slidesToShow;
        }
    }, [options]);

    const checkShouldDisableSlider = useCallback(() => {
        const slidesPerView = getCurrentSlidesPerView() || 1;
        setIsSliderValid(totalSlides > slidesPerView + offset);
        setIsSliderInitialized(true);
    }, [getCurrentSlidesPerView, totalSlides, offset]);

    useEffect(() => {
        checkShouldDisableSlider();

        window.addEventListener('resize', checkShouldDisableSlider);

        return () => {
            window.removeEventListener('resize', checkShouldDisableSlider);
        };
    }, [checkShouldDisableSlider]);

    return { isSliderValid, isSliderInitialized }
}

export default useSliderValidation