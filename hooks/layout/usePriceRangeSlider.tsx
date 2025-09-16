import { useState, useRef, useEffect, useCallback, useMemo } from "react"

import { PRICE_SLIDER_CONFIG, PRICE_RANGE_DRAGGING_TYPES } from "@/constants/index"

const { PERCENT_BOUNDS, PERCENT_MULTIPLIER } = PRICE_SLIDER_CONFIG;
const { DRAGGING_MIN } = PRICE_RANGE_DRAGGING_TYPES;

interface UsePriceRangeSliderProps {
    min: number;
    max: number;
    step: number;
    range: [number, number];
    onChange: (range: [number, number]) => void;
}

const usePriceRangeSlider = ({ 
    min, 
    max, 
    step, 
    range, 
    onChange 
}: UsePriceRangeSliderProps) => {
    const [isDragging, setIsDragging] = useState<PriceRangeDraggingType | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((type: PriceRangeDraggingType) => {
        setIsDragging(type);
    }, [])

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !sliderRef.current) return;

        const slider = sliderRef.current;
        const rect = slider.getBoundingClientRect();
        const percent = Math.max(PERCENT_BOUNDS.MIN, Math.min(PERCENT_BOUNDS.MAX, (e.clientX - rect.left) / rect.width));
        const value = Math.round((percent * (max - min) + min) / step) * step;

        if (isDragging === DRAGGING_MIN) {
            onChange([Math.min(value, range[1] - step), range[1]]);
        } else {
            onChange([range[0], Math.max(value, range[0] + step)]);
        }
    }, [isDragging, min, max, step, range, onChange])

    const handleMouseUp = useCallback(() => {
        setIsDragging(null);
    }, [])

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const { minPercent, maxPercent } = useMemo(() => ({
        minPercent: ((range[0] - min) / (max - min)) * PERCENT_MULTIPLIER,
        maxPercent: ((range[1] - min) / (max - min)) * PERCENT_MULTIPLIER
    }), [range, min, max]);

    return {
        isDragging,
        sliderRef,
        handleMouseDown,
        minPercent,
        maxPercent
    }
}

export default usePriceRangeSlider