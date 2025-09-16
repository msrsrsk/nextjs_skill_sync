import Link from "next/link"

import { commonSocialLinks } from "@/data/links"

const SocialLinks = ({ 
    customClass 
}: { customClass?: string }) => {
    return (
        <div className={`social-linkbox${
            customClass ? ` ${customClass}` : ""
        }`}>
            {commonSocialLinks.map((link) => {
                const Icon = link.icon;

                return (
                    <Link 
                        key={link.label} 
                        href={link.href} 
                        aria-label={link.label}
                    >
                        <Icon className="w-6 h-6"/>
                    </Link>
                );
            })}
        </div>
    )
}

export default SocialLinks