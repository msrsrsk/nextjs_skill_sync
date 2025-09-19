import Link from "next/link";

interface TabNavigationProps {
    links: {
        label: string;
        href: string;
        children?: {
            label: string;
            href: string;
        }[];
    }[];
    category: string;
}

const TabNavigation = ({
    links,
    category,
}: TabNavigationProps) => {
    const allChildren = links.flatMap(link => link.children || []);

    return (
        <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
            <ul role="list" className="menu-linkbox mb-8 md:mb-[64px] justify-start sm:justify-center">
                {allChildren?.map(({ label, href }) => {
                    const displayLabel = label.split(' ')[0];
                    const isActive = displayLabel === category;

                    return (
                        <li 
                            key={displayLabel} 
                            className={`menu-link uppercase font-poppins${
                                isActive ? ' is-active' : ''
                            }`}
                        >
                            <Link href={href}>
                                {displayLabel}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default TabNavigation