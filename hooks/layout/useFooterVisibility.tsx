import { useState, useEffect, useCallback } from "react"

export const useFooterVisibility = ({ offset = 0 }: { offset?: number }) => {
    const [isFooterVisible, setIsFooterVisible] = useState(false);

    const checkFooterVisibility = useCallback(() => {
        const footer = document.querySelector('footer');
        if (!footer) return;

        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const isVisible = footerRect.top <= (windowHeight + offset);
        setIsFooterVisible(isVisible);
    }, [offset])

    useEffect(() => {
        checkFooterVisibility();

        window.addEventListener('scroll', checkFooterVisibility);
        window.addEventListener('resize', checkFooterVisibility);

        return () => {
            window.removeEventListener('scroll', checkFooterVisibility);
            window.removeEventListener('resize', checkFooterVisibility);
        }
    }, [])

    return isFooterVisible;
};