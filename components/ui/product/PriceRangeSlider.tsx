"use client"

import usePriceRangeSlider from "@/hooks/layout/usePriceRangeSlider"
import { PRICE_SLIDER_CONFIG } from "@/constants/index"

const { INITIAL_STEP } = PRICE_SLIDER_CONFIG;

interface PriceRangeSliderProps {
    min: number;
    max: number;
    step?: number;
    range: [number, number];
    onChange: (range: [number, number]) => void;
}

const PriceRangeSlider = ({ 
    min, 
    max, 
    step = INITIAL_STEP, 
    range, 
    onChange 
}: PriceRangeSliderProps) => {
    const {
        sliderRef,
        handleMouseDown,
        minPercent,
        maxPercent
    } = usePriceRangeSlider({
        min,
        max,
        step,
        range,
        onChange
    });

    return (
        <div className="price-range">
            {/* Slider Background */}
            <div 
                ref={sliderRef}
                className="price-range-bg"
            >
                {/* Selected Range Background */}
                <div 
                    className="price-range-selected"
                    style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`
                    }}
                />
            </div>

            <div
                className="price-range-handle"
                style={{ left: `calc(${minPercent}% - 8px)` }}
                onMouseDown={() => handleMouseDown('min')}
            />

            <div
                className="price-range-handle"
                style={{ left: `calc(${maxPercent}% - 8px)` }}
                onMouseDown={() => handleMouseDown('max')}
            />
        </div>
    );
};

export default PriceRangeSlider