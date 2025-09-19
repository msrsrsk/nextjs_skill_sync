import { Heart, Search } from "lucide-react"

import IconBox from "@/components/common/icons/IconBox"
import CartIcon from "@/components/common/icons/CartIcon"
import { AccountIcon } from "@/components/common/display/AccountAuth"
import { useSearchStore } from "@/app/stores/useStore"
import { HamburgerIcon } from "@/components/common/icons/SvgIcons"
import { SITE_MAP } from "@/constants/index"

const { BOOK_MARK_PATH } = SITE_MAP;

const NavIcons = ({ 
    setDrawerOpen 
}: { setDrawerOpen: (open: boolean) => void }) => {
    const { searchBoxOpen, setSearchBoxOpen } = useSearchStore();

    return <>
        <div className="flex items-center gap-1 md-lg:hidden">
            <AccountIcon />
            <CartIcon strokeWidth={2.2} />
            <button 
                className="icon" 
                aria-label="Menu" 
                onClick={() => setDrawerOpen(true)}
            >
                <HamburgerIcon />
            </button>
        </div>

        <div className="hidden md-lg:flex items-center gap-4">
            <AccountIcon />
            <IconBox 
                link={BOOK_MARK_PATH}
                label="Bookmark" 
            >
                <Heart className="w-6 h-6" strokeWidth={2.5} />
            </IconBox>
            <button 
                className="icon" 
                aria-label="検索ボックスを開く"
                onClick={() => setSearchBoxOpen(!searchBoxOpen)}
            >
                <Search width={24} height={24} strokeWidth={2.5} />
            </button>
            <CartIcon 
                customClass="w-[22px] h-[22px] md:w-6 md:h-6" 
                strokeWidth={2.5} 
            />
        </div>
    </>
}

export default NavIcons