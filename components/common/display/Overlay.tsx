import { OVERLAY_TYPES } from "@/constants/index"

const { WITH_HEADER } = OVERLAY_TYPES;

interface OverlayProps {
    isActive: boolean;
    setActive: (value: boolean) => void;
    type?: OverlayType;
}

const Overlay = ({ 
    isActive, 
    setActive, 
    type = WITH_HEADER 
}: OverlayProps) => {
    if (!isActive) return null;

    return (
        <div 
            className={`overlay${
                type === WITH_HEADER ? ' z-[100]' : ' z-30'}${
                isActive ? ' opacity-100 visible' : ' opacity-0 invisible'
            }`}
            onClick={() => {
                setActive(false);
            }}
        ></div>
    )
}

export default Overlay