import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { DEFAULT_PAGE } from "@/constants/index"

interface UseTabPaginationProps {
    currentCategory: string;
    basePath: string;
}

const useTabPagination = ({
    currentCategory, 
    basePath 
}: UseTabPaginationProps) => {
    const [activeTab, setActiveTab] = useState(currentCategory);

    const router = useRouter();
    const searchParams = useSearchParams();

    const createTabUrl = useCallback((category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', category);
        params.set('page', DEFAULT_PAGE);
        return `${basePath}?${params.toString()}`;
    }, [basePath, searchParams])

    const handleTabChange = useCallback((category: string) => {
        setActiveTab(category);
        router.push(createTabUrl(category));
    }, [createTabUrl, router])

    return {
        activeTab,
        handleTabChange
    }
}

export default useTabPagination