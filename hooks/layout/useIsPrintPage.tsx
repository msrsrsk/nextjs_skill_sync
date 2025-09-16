import { usePathname } from "next/navigation"

import { SITE_MAP } from "@/constants/index"

const { PRINT_PATH } = SITE_MAP;

const useIsPrintPage = () => {
    const pathname = usePathname();
    return pathname.includes(PRINT_PATH);
}

export default useIsPrintPage