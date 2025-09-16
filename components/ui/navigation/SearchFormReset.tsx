"use client"

import Link from "next/link"
import { CircleX } from "lucide-react"

import { SITE_MAP, SEARCH_FORM_SIZES } from "@/constants/index"

const { SEARCH_MEDIUM } = SEARCH_FORM_SIZES;
const { REVIEW_PATH } = SITE_MAP;

interface SearchFormResetProps {
    size?: SearchFormSizeType;
}

const SearchFormReset = ({ size = SEARCH_MEDIUM }: SearchFormResetProps) => {
    const reset = () => {
        const form = document.querySelector('.search-form') as HTMLFormElement;
        if (form) form.reset();
    }

    const isMedium = size === SEARCH_MEDIUM;

    return (
        <button 
            type="reset" 
            aria-label="検索フォームをリセットする"
            onClick={reset}
        >
            <Link href={REVIEW_PATH}>
                <CircleX 
                    className={`text-sub${
                        isMedium ? ' w-5 h-5' : ' w-6 h-6'
                    }`} 
                    strokeWidth={isMedium ? 2 : 2.5} 
                />
            </Link>
        </button>
    )
}

export default SearchFormReset