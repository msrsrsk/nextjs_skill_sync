import { useEffect, useState, useCallback } from "react";

const useHeaderHeight = ({ 
    headerRef 
}: { headerRef: React.RefObject<HTMLElement> }) => {
    const [headerHeight, setHeaderHeight] = useState(0);

    const updateHeaderHeight = useCallback(() => {
        const header = headerRef.current;

        if (header) {
            const height = header.offsetHeight;
            document.documentElement.style.setProperty('--header-height', `${height}px`);
            setHeaderHeight(-height); 
        }
    }, [headerRef])

    useEffect(() => {
        updateHeaderHeight();

        window.addEventListener('resize', updateHeaderHeight);

        return () => {
            window.removeEventListener('resize', updateHeaderHeight);
        }
    }, [updateHeaderHeight])

    return headerHeight;
};

export default useHeaderHeight