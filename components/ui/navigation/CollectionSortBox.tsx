"use client";

import { ArrowUpDown } from "lucide-react"

import FilterTitleBox from "@/components/common/display/FilterTitleBox"
import useCollectionSort from "@/hooks/data/useCollectionSort"
import { useCollectionSortStore } from "@/app/stores/useStore"
import { formatCollectionSortType } from "@/services/product/format"
import { EventButtonPrimary } from "@/components/common/buttons/Button"
import { COLLECTION_SORT_TYPES, BUTTON_TEXT_TYPES, BUTTON_TYPES } from "@/constants/index"

const { BUTTON_JA } = BUTTON_TEXT_TYPES;
const { SUBMIT_TYPE } = BUTTON_TYPES;

const CollectionSortBox = () => {
    const { 
        collectionSortOpen, 
        setCollectionSortOpen 
    } = useCollectionSortStore();

    const { 
        sortType, 
        setSortType, 
        handleSave 
    } = useCollectionSort({
        setCollectionSortOpen
    });

    return (
        <div className={`filter-box${
            collectionSortOpen ? ' is-active' : ''
        }`}>
            <form className="filter-inner" onSubmit={handleSave}>
                <FilterTitleBox title="Sort">
                    <ArrowUpDown className="w-5 h-5" strokeWidth={2} />
                </FilterTitleBox>

                <div className="filter-sort-box">
                    {Object.entries(COLLECTION_SORT_TYPES).map(([key, value]) => (
                        <button 
                            key={key}
                            className={`filter-sort-button${
                                sortType === value ? ' is-active' : ''
                            }`} 
                            onClick={() => setSortType(value)}
                        >
                            {formatCollectionSortType(value)}
                        </button>
                    ))}
                </div>

                <EventButtonPrimary
                    customClass="mt-6 md:mt-8"
                    text={BUTTON_JA}
                    type={SUBMIT_TYPE}
                >
                    保存する
                </EventButtonPrimary>
            </form>
        </div>
    )
}

export default CollectionSortBox