import { usePathname } from "next/navigation"

import { SITE_MAP } from "@/constants/index"

const { CATEGORY_PATH } = SITE_MAP;

const useIsProductPage = () => {
    const pathname = usePathname();
    const isProductPage = pathname.startsWith(CATEGORY_PATH + '/');

    return {
        isProductPage
    };
}

export default useIsProductPage