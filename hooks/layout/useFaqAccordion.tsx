import { useState, useCallback } from "react"

const useFaqAccordion = () => {
    const [expandedItemKey, setExpandedItemKey] = useState<string | null>(null);

    const createItemKey = useCallback((categoryIndex: number, faqIndex: number) => 
        `${categoryIndex}-${faqIndex}`, 
        []
    );

    const toggleAccordion = useCallback((categoryIndex: number, faqIndex: number) => {
        const itemKey = createItemKey(categoryIndex, faqIndex);
        setExpandedItemKey(prev => prev === itemKey ? null : itemKey);
    }, [createItemKey])

    const getExpandedState = useCallback((categoryIndex: number, faqIndex: number) => {
        const itemKey = createItemKey(categoryIndex, faqIndex);
        return expandedItemKey === itemKey;
    }, [expandedItemKey, createItemKey])

    return {
        expandedItemKey,
        toggleAccordion,
        getExpandedState
    }
}

export default useFaqAccordion