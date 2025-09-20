"use client"

import Link from "next/link"
import { motion } from 'framer-motion'
import { usePathname } from "next/navigation"
import { Link as Scroll } from "react-scroll"

import useAccordion from "@/hooks/layout/useAccordion"
import { navLinks } from "@/data/links"
import { accordionAnimation } from "@/lib/motion"
import { ToggleIcon } from "@/components/common/icons/SvgIcons"
import { DRAWER_CLOSE_DELAY, SITE_MAP } from "@/constants/index"

const { HOME_PATH, ANOTHER_WORLD_PATH } = SITE_MAP;

interface DrawerNavLinksProps {
    setDrawerOpen: (open: boolean) => void;
    headerHeight: number;
}

const DrawerNavLinks = ({ 
    setDrawerOpen,
    headerHeight
}: DrawerNavLinksProps) => {
    const { expandedIndex, toggleAccordion } = useAccordion(0);

    const pathname = usePathname();

    const handleCloseDrawer = () => {
        setTimeout(() => {
            setDrawerOpen(false);
        }, DRAWER_CLOSE_DELAY)
    }

    return (
        <ul 
            role="list"
            className="drawer-navlink-wrapper"
        >
            {navLinks.map((links, index) => {
                const isActive = expandedIndex === index;

                return (
                    <li 
                        key={links.label} 
                        className={`drawer-navlink-box group grid${
                            isActive ? ' is-active' : ''
                        }`}
                    >
                        {links.children ? (
                            <div 
                                className="drawer-navlink-titlebox bg-background"
                                onClick={() => toggleAccordion(index)}
                            >
                                <h2 className="drawer-title">{links.label}</h2>
                                <ToggleIcon 
                                    customClass="group-[.is-active]:rotate-[180deg] group-[.is-active]:transition-all group-[.is-active]:duration-[400ms] transition-all duration-[400ms]"
                                    verticalClass="group-[.is-active]:opacity-0 group-[.is-active]:invisible group-[.is-active]:transition-all group-[.is-active]:duration-[400ms]" 
                                />
                            </div>
                        ) : <>
                            {links.label === "Another World" ? (
                                pathname === HOME_PATH ? (
                                    <Scroll 
                                        to="another-world" 
                                        smooth={true} 
                                        duration={500}
                                        offset={headerHeight}
                                        className="drawer-navlink-titlebox"
                                        onClick={handleCloseDrawer}
                                    >
                                        <span className="drawer-title">
                                            {links.label}
                                        </span>
                                    </Scroll>
                                ) : (
                                    <Link 
                                        href={ANOTHER_WORLD_PATH}
                                        className="drawer-navlink-titlebox"
                                        onClick={() => setDrawerOpen(false)}
                                    >
                                        <span className="drawer-title">
                                            {links.label}
                                        </span>
                                    </Link>
                                )
                            ) : (
                                <Link 
                                    href={links.href} 
                                    className="drawer-navlink-titlebox"
                                >
                                    {links.label}
                                </Link>
                            )}
                        </>}
                        {links.children && (
                            <motion.ul
                                role="list"
                                variants={accordionAnimation()}
                                initial="initial"
                                animate={isActive ? 'animate' : 'exit'}
                                className="bg-background"
                            >
                                {links.children && links.children.map((link) => (
                                    <li 
                                        key={link.label} 
                                        className="drawer-navlink-item"
                                    >
                                        <Link 
                                            href={link.href} 
                                            className="drawer-navlink-link"
                                            onClick={() => setDrawerOpen(false)}
                                        >
                                            {pathname === link.href && (
                                                <span className="drawer-navlink-active absolute left-2 top-1/2 -translate-y-1/2"></span>
                                            )}
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </li>
                )
            })}
        </ul>
    )
}

export default DrawerNavLinks