import Link from "next/link"

import { UNDERLINE_LINK_POSITIONS } from "@/constants/index"

const { POSITION_CENTER } = UNDERLINE_LINK_POSITIONS;

interface UnderlineLinkProps {
    href: string
    text: string
    position?: UnderlineLinkPositionType
    customClass?: string
}

const UnderlineLink = ({ 
    href, 
    text, 
    position = POSITION_CENTER, 
    customClass 
}: UnderlineLinkProps) => {
    return (
        <div className={`flex justify-${position}${customClass ? ` ${customClass}` : ""}`}>
            <Link 
                href={href} 
                className="text-base leading-[20px] font-bold font-poppins py-1 border-b border-foreground"
            >
                {text}
            </Link>
        </div>
    )
}

export default UnderlineLink