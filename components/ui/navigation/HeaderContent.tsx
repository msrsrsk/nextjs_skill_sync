"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useRef } from "react"

import NavIcons from "@/components/layout/NavIcons"
import NavLinks from "@/components/layout/NavLinks"
import Drawer from "@/components/layout/Drawer"
import DesktopSearchBox from "@/components/ui/navigation/DesktopSearchBox"
import CollectionFilterBox from "@/components/ui/navigation/CollectionFilterBox"
import CollectionSortBox from "@/components/ui/navigation/CollectionSortBox"
import Overlay from "@/components/common/display/Overlay"
import useIsMobile from "@/hooks/layout/useIsMobile"
import usePreventScroll from "@/hooks/utils/usePreventScroll"
import useIsPrintPage from "@/hooks/layout/useIsPrintPage"
import useHeaderHeight from "@/hooks/layout/useHeaderHeight"
import { 
    useSearchStore, 
    useCollectionFilterStore,
    useCollectionSortStore 
} from "@/app/stores/useStore"
import { MEDIA_QUERY_CONFIG, OVERLAY_TYPES, SITE_MAP } from "@/constants/index"

const { SIZE_LARGE_MEDIUM } = MEDIA_QUERY_CONFIG;
const { WITHOUT_HEADER } = OVERLAY_TYPES;
const { HOME_PATH, IMAGE_PATH } = SITE_MAP;

const HeaderContent = ({ 
    priceBounds 
}: { priceBounds: ProductPriceBounds }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const headerRef = useRef(null);
    
    const { searchBoxOpen, setSearchBoxOpen } = useSearchStore();
    const { collectionFilterOpen, setCollectionFilterOpen } = useCollectionFilterStore();
    const { collectionSortOpen, setCollectionSortOpen } = useCollectionSortStore();
    
    const isPrintPage = useIsPrintPage();
    const isMobile = useIsMobile({ mediaQuery: SIZE_LARGE_MEDIUM });
    
    const headerHeight = useHeaderHeight({ headerRef });
    const isOpen = searchBoxOpen || collectionFilterOpen || collectionSortOpen;
    
    usePreventScroll(isOpen);

    const getSetActive = () => {
        if (searchBoxOpen) return setSearchBoxOpen;
        if (collectionFilterOpen) return setCollectionFilterOpen;
        if (collectionSortOpen) return setCollectionSortOpen;
        return () => {};
    };

    return <>
        <header 
            ref={headerRef}
            className={`header${
                isOpen ? ' bg-background' : ' grass-no-gradient'}${
                isPrintPage ? ' hidden' : ''
            }`}
        >
            <div className="header-wrapper">
                <div className="header-inner">
                    <Link href={HOME_PATH}>
                        <h1>
                            <Image 
                                className="header-logo" 
                                src={`${IMAGE_PATH}/logo.png`} 
                                alt="SKILL SYNC" 
                                width={249} 
                                height={40} 
                                priority={true} 
                            />
                        </h1>
                    </Link>
                    <NavIcons 
                        setDrawerOpen={setDrawerOpen} 
                    />
                </div>
                <NavLinks headerHeight={headerHeight} />
            </div>
            {isMobile && (
                <Drawer 
                    drawerOpen={drawerOpen} 
                    setDrawerOpen={setDrawerOpen} 
                    headerHeight={headerHeight}
                />
            )}

            <DesktopSearchBox />
            <CollectionFilterBox 
                priceBounds={priceBounds}
            />
            <CollectionSortBox />
        </header>

        <Overlay 
            isActive={isOpen} 
            setActive={getSetActive()} 
            type={WITHOUT_HEADER}
        />
    </>
}

export default HeaderContent