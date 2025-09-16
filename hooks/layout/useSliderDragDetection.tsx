import { useState, useCallback } from "react"

const useSliderDragDetection = () => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = useCallback(() => {
        if (!isDragging) setIsDragging(true);
    }, [isDragging])

    const handleDragEnd = useCallback(() => {
        if (isDragging) setIsDragging(false);
    }, [isDragging])

    return {
        isDragging,
        handleDragStart,
        handleDragEnd
    };
};

export default useSliderDragDetection