"use client";

import { SlidersHorizontal } from "lucide-react"

import PriceRangeSlider from '@/components/ui/product/PriceRangeSlider'
import FilterTitleBox from "@/components/common/display/FilterTitleBox"
import useCollectionFilter from "@/hooks/data/useCollectionFilter"
import { getStepByPriceRange } from "@/services/product/calculation"
import { useCollectionFilterStore } from "@/app/stores/useStore"
import { EventButtonPrimary } from "@/components/common/buttons/Button"
import { BUTTON_TEXT_TYPES, BUTTON_TYPES, PRICE_SLIDER_CONFIG } from "@/constants/index"

const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { SUBMIT_TYPE } = BUTTON_TYPES;
const { PRICE_MIN } = PRICE_SLIDER_CONFIG;

const CollectionFilterBox = ({ priceBounds }: { priceBounds: ProductPriceBounds }) => {
    const { 
        collectionFilterOpen, 
        setCollectionFilterOpen 
    } = useCollectionFilterStore();

    const { 
        isStock, 
        setIsStock, 
        priceRange, 
        handlePriceChange, 
        handleSave 
    } = useCollectionFilter({
        priceBounds,
        setCollectionFilterOpen
    });

    const priceStep = getStepByPriceRange(priceBounds.maxPrice);

    return (
        <div className={`filter-box${
            collectionFilterOpen ? ' is-active' : ''
        }`}>
            <form className="filter-inner" onSubmit={handleSave}>
                <FilterTitleBox title="Filter">
                    <SlidersHorizontal 
                        className="w-5 h-5" 
                        strokeWidth={2} 
                    />
                </FilterTitleBox>

                <div className="filter-stock-box">
                    <h3 className="filter-label">在庫あり</h3>
                    <div className="filter-stock-content">
                        <button 
                            className={`filter-stock-button${
                                !isStock ? ' is-active' : ''
                            }`} 
                            onClick={() => setIsStock(false)}
                        >
                            <span>OFF</span>
                        </button>
                        <button 
                            className={`filter-stock-button${
                                isStock ? ' is-active' : ''
                            }`} 
                            onClick={() => setIsStock(true)}>
                            <span>ON</span>
                        </button>
                    </div>
                </div>

                <div className="flex">
                    <h3 className="filter-label">価格</h3>
                    <div className="filter-price-range">
                        <div className="mb-3">
                            <PriceRangeSlider
                                min={PRICE_MIN}
                                max={priceBounds.maxPrice}
                                step={priceStep}
                                range={priceRange}
                                onChange={handlePriceChange}
                            />
                        </div>
                        <div className="filter-price-box">
                            <p className="filter-price-text">
                                <span className="text-xs">¥</span>
                                {priceRange[0].toLocaleString()}
                            </p>
                            <p className="filter-price-text">
                                <span className="text-xs">¥</span>
                                {priceRange[1].toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <EventButtonPrimary
                    customClass="button-space-default"
                    text={BUTTON_JA}
                    type={SUBMIT_TYPE}
                >
                    保存する
                </EventButtonPrimary>
            </form>
        </div>
    )
}

export default CollectionFilterBox