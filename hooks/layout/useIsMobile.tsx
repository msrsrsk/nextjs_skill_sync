import { useMediaQuery } from "react-responsive"
import { MEDIA_QUERY_CONFIG, MOBILE_BREAKPOINT_OFFSET } from "@/constants/index"

const { SIZE_MEDIUM } = MEDIA_QUERY_CONFIG;

interface UseIsMobileProps {
    mediaQuery?: number;
}

const useIsMobile = ({ mediaQuery = SIZE_MEDIUM }: UseIsMobileProps = {}) => {
    const isMobile = useMediaQuery({ 
        maxWidth: mediaQuery - MOBILE_BREAKPOINT_OFFSET 
    })
    
    return isMobile;
};

export default useIsMobile