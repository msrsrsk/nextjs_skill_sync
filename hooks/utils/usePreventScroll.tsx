import { useEffect } from "react"

const usePreventScroll = (isActive: boolean) => {
    useEffect(() => {
        document.body.style.overflow = isActive ? 'hidden' : 'unset';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isActive])
}

export default usePreventScroll