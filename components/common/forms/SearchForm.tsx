import { Search } from "lucide-react"

import SearchFormReset from "@/components/ui/navigation/SearchFormReset"
import { SEARCH_FORM_SIZES } from "@/constants/index"

const { SEARCH_MEDIUM } = SEARCH_FORM_SIZES;

interface SearchFormProps {
    query?: string;
    size?: SearchFormSizeType;
    action?: string;
}

const SearchForm = ({ 
    query, 
    size = SEARCH_MEDIUM,
    action
}: SearchFormProps) => {
    const isMedium = size === SEARCH_MEDIUM;

    return (
        <form 
            className={`search-form flex items-center justify-between${
                isMedium ? ' gap-2 border-b border-foreground' : ' gap-6'
            }`}
            action={action}
            method="GET"
        >
            <div className={`flex items-center w-full${
                isMedium ? ' gap-3' : ' gap-6'
            }`}>
                <input 
                    name="query"
                    defaultValue={query}
                    placeholder="キーワードを入力してください" 
                    className={`bg-transparent border-none outline-none border-box w-full py-3 leading-6 font-medium placeholder:text-sub${size === 'medium' ? ' text-sm' : ' text-base min-h-[64px]'}`} 
                />
            </div>
            
            <div className="flex items-center gap-3">
                {query && <SearchFormReset size={size} />}

                <button 
                    type="submit" 
                    className={`grid place-items-center bg-brand rounded-full${
                        isMedium ? ' w-8 h-8' : ' w-10 h-10'
                    }`}
                    aria-label="検索する"
                >
                    <Search 
                        className={`text-white${
                            isMedium ? ' w-4 h-4' : ' w-[18px] h-[18px]'
                        }`} 
                        strokeWidth={isMedium ? 2 : 2.2} 
                    />
                </button>
            </div>
        </form>
    )
}

export default SearchForm