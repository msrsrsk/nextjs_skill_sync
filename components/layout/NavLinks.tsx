import Link from "next/link"
import { usePathname } from "next/navigation"
import { Link as Scroll } from "react-scroll"

import useAccordion from "@/hooks/layout/useAccordion"
import { navLinks } from "@/data/links"
import { SITE_MAP } from "@/constants/index"

const { HOME_PATH, ANOTHER_WORLD_PATH } = SITE_MAP;

const NavLinks = ({ 
    headerHeight 
}: { headerHeight: number }) => {
    const { expandedIndex, toggleAccordion } = useAccordion(null);

    const pathname = usePathname();

    return (
        <nav className="hidden md-lg:block">
            <ul role="list" className="md-lg:flex items-center gap-[60px]">
                {navLinks.map((links, index) => (
                    <li 
                        key={links.label} 
                        className={`nav-linklist${
                            expandedIndex === index ? ' is-active' : ''
                        }`}
                        onMouseEnter={() => toggleAccordion(index)}
                        onMouseLeave={() => toggleAccordion(null)}
                    >
                        {links.label === "Another World" ? (
                            pathname === HOME_PATH ? (
                                <Scroll 
                                    to="another-world" 
                                    smooth={true} 
                                    duration={500}
                                    offset={headerHeight}
                                    className="nav-link cursor-pointer"
                                >
                                    {links.label}
                                </Scroll>
                            ) : (
                                <Link 
                                    href={ANOTHER_WORLD_PATH}
                                    className="nav-link cursor-pointer"
                                >
                                    {links.label}
                                </Link>
                            )
                        ) : (
                            <Link href={links.href} className="nav-link">
                                {links.label}
                            </Link>
                        )}

                        {links.children && (
                            <ul
                                role="list"
                                className="nav-childbox"
                            >
                                {links.children && links.children.map((link) => (
                                    <li 
                                        key={link.label} 
                                        className="drawer-navlink-item"
                                    >
                                        <Link 
                                            href={link.href} 
                                            className="drawer-navlink-link"
                                        >
                                            {pathname === link.href && (
                                                <span className="drawer-navlink-active" />
                                            )}
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default NavLinks