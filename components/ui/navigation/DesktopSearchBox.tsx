"use client"

import { useEffect } from "react"

import SearchForm from "@/components/common/forms/SearchForm"
import useIsMobile from "@/hooks/layout/useIsMobile"
import { useSearchStore } from "@/app/stores/useStore"
import { MEDIA_QUERY_CONFIG, SEARCH_FORM_SIZES } from "@/constants/index"

const { SIZE_LARGE_MEDIUM } = MEDIA_QUERY_CONFIG;
const { SEARCH_LARGE } = SEARCH_FORM_SIZES;

const DesktopSearchBox = () => {
    const { searchBoxOpen, setSearchBoxOpen } = useSearchStore();

    const isMobile = useIsMobile({ mediaQuery: SIZE_LARGE_MEDIUM });

    useEffect(() => {
        if (isMobile && searchBoxOpen) {
            setSearchBoxOpen(false);
        }
    }, [isMobile, searchBoxOpen]);

    return (
        <div className={`desktop-search-box${
            searchBoxOpen ? ' is-active' : ''
        }`}>
            <SearchForm 
                size={SEARCH_LARGE} 
                action="/search"
            />
        </div>
    )
}

export default DesktopSearchBox