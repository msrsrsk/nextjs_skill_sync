import useIsMobile from "@/hooks/layout/useIsMobile"
import { MoreIcon } from "@/components/common/icons/SvgIcons"
import { MEDIA_QUERY_CONFIG } from "@/constants/index"

const { SIZE_MEDIUM } = MEDIA_QUERY_CONFIG;

interface PointerProps {
    position: { x: number; y: number };
    label: string;
    isHovered: boolean;
}

const Pointer = ({ 
    position, 
    label, 
    isHovered 
}: PointerProps) => {
    const isMobile = useIsMobile();

    return (
        <div
            className={`hover-pointer${
                !isMobile && isHovered ? ' is-hovered' : ''
            }`}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
        >
            <div className="hover-pointer-inner">
                <MoreIcon color="#222222" />
                <span className="uppercase">{label}</span>
            </div>
        </div>
    );
};

export default Pointer