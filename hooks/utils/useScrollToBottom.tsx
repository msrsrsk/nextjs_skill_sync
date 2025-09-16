import { useRef, useCallback } from "react"

const useScrollToBottom = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior,
            });
        }
    }, [])

    return {
        scrollRef,
        scrollToBottom,
    }
}

export default useScrollToBottom