import { useCallback, useEffect, DependencyList } from "react"

import { SCROLL_TOP_CONFIG } from "@/constants/index"

const { THRESHOLD_TOP, DELAY_TIME } = SCROLL_TOP_CONFIG;

interface UsePageScrollResetProps {
    dependencies?: DependencyList;
    condition?: boolean;
}

const usePageScrollReset = ({ 
    dependencies = [], 
    condition = true 
}: UsePageScrollResetProps = {}) => {
    const scrollTop = useCallback(() => {
        window.scrollTo({
            top: THRESHOLD_TOP,
            behavior: 'smooth',
        });
    }, []);

    useEffect(() => {
        if (condition) {
            setTimeout(scrollTop, DELAY_TIME);
        }
    }, dependencies);

    return scrollTop;
}

export default usePageScrollReset