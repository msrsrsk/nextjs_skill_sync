import { useState, useCallback } from "react";

const useAccordion = (
    initialIndex: number | null
) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(initialIndex);

    const toggleAccordion = useCallback((index: number | null) => {
        setExpandedIndex((currentIndex) => currentIndex === index ? null : index);
    }, [])

    return {
        expandedIndex,
        toggleAccordion
    }
}

export default useAccordion