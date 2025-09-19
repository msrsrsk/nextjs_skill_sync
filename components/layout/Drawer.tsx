"use client"

import Image from "next/image"
import Link from "next/link"

import SearchForm from "@/components/common/forms/SearchForm"
import IconBox from "@/components/common/icons/IconBox";
import CartIcon from "@/components/common/icons/CartIcon"
import DrawerNavLinks from "@/components/layout/DrawerNavLinks"
import SocialLinks from "@/components/common/icons/SocialLinks"
import usePreventScroll from "@/hooks/utils/usePreventScroll"
import { CircleX, Heart } from "lucide-react"
import { AccountButton } from "@/components/common/display/AccountAuth"
import { SITE_MAP } from "@/constants/index"

const { HOME_PATH, IMAGE_PATH, BOOK_MARK_PATH } = SITE_MAP;

interface DrawerProps {
    drawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
    headerHeight: number;
}

const Drawer = ({ 
    drawerOpen, 
    setDrawerOpen, 
    headerHeight 
}: DrawerProps) => {
    usePreventScroll(drawerOpen);

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    }

    return <>
        {drawerOpen && (
            <div className={`fixed w-full h-screen inset-0 bg-background z-[999] flex flex-col px-5 py-[64px] overflow-auto transition-opacity duration-300`}>
                <button
                    className="absolute top-[22px] right-[22px]"
                    aria-label="ドロワーを閉じる"
                    onClick={() => setDrawerOpen(false)}
                >
                    <CircleX className="w-6 h-6" strokeWidth={2} />
                </button>

                <Link 
                    href={HOME_PATH} 
                    className="mx-auto inline-block mb-6"
                >
                    <Image 
                        className="max-w-[175px] w-full h-auto" 
                        src={`${IMAGE_PATH}/logo.png`} 
                        alt="SKILL SYNC" 
                        width={180} 
                        height={30} 
                        priority={true} 
                    />
                </Link>

                <AccountButton />

                <div className="mb-[28px]">
                    <SearchForm action="/search" />
                </div>

                <div className="flex items-center gap-6 justify-center mb-[28px]">
                    <CartIcon 
                        customClass="w-[22px] h-[22px]" 
                        strokeWidth={2.2} 
                        onClick={handleCloseDrawer}
                    />
                    <IconBox 
                        link={BOOK_MARK_PATH} 
                        label="Bookmark" 
                        onClick={handleCloseDrawer}
                    >
                        <Heart 
                            className="w-[22px] h-[22px]" 
                            strokeWidth={2.2} 
                        />
                    </IconBox>
                </div>

                <div className="mb-10">
                    <DrawerNavLinks 
                        setDrawerOpen={setDrawerOpen} 
                        headerHeight={headerHeight}
                    />
                </div>

                <SocialLinks customClass="gap-x-10 justify-center" />
            </div>
        )}
    </>
}

export default Drawer