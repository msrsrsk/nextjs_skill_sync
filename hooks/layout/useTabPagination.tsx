import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { DEFAULT_PAGE } from "@/constants/index"

interface UseTabPaginationProps<T extends string = string> {
    currentCategory: T;
    basePath: string;
}

const useTabPagination = <T extends string = string>({
    currentCategory, 
    basePath 
}: UseTabPaginationProps<T>) => {
    const [activeTab, setActiveTab] = useState<T>(currentCategory);

    const router = useRouter();
    const searchParams = useSearchParams();

    const createTabUrl = useCallback((category: T) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', category);
        params.set('page', DEFAULT_PAGE);
        return `${basePath}?${params.toString()}`;
    }, [basePath, searchParams])

    const handleTabChange = useCallback((category: T) => {
        setActiveTab(category);
        router.push(createTabUrl(category));
    }, [createTabUrl, router])

    return {
        activeTab,
        handleTabChange
    }
}

export default useTabPagination