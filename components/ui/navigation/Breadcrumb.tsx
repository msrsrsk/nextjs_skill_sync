"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SITE_MAP } from "@/constants/index"

const { HOME_PATH } = SITE_MAP;

const Breadcrumb = ({ 
    isProductDetail = false
 }: { isProductDetail?: boolean }) => {
    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    
    const breadcrumbItems = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/')
        
        const label = segment
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        
        return {
            href,
            label,
            isCurrent: index === pathSegments.length - 1
        }
    })

    return (
        <div className={`mb-4 mt-2 md:mt-4${
            !isProductDetail ? ' ml-5 md:ml-20' : ''
        }`}>
            <nav 
                className="breadcrumb-nav"
                aria-label="パンくずリスト"
            >
                <div className={`overflow-x-auto overflow-y-hidden scrollbar-hide pr-5 ${
                    !isProductDetail ? ' md:pr-20' : ''
                }`}>
                    <ul className="flex items-center gap-10 min-w-max">
                        <li className="breadcrumb-item font-poppins flex-shrink-0">
                            <Link 
                                className="underline"
                                href={HOME_PATH}
                            >
                                Home
                            </Link>
                        </li>

                        {breadcrumbItems.map((item, index) => (
                            <li key={index} className="breadcrumb-item font-poppins capitalize">
                                {item.isCurrent ? (
                                    <span aria-current="page">{item.label}</span>
                                ) : (
                                    <Link href={item.href} className="underline">
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Breadcrumb