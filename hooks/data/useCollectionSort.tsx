import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { COLLECTION_SORT_TYPES, DEFAULT_PAGE } from "@/constants/index"

const { CREATED_DESCENDING } = COLLECTION_SORT_TYPES;

const useCollectionSort = ({ 
    setCollectionSortOpen 
}: { setCollectionSortOpen: (open: boolean) => void }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getCurrentSortType = useCallback((): string => {
        return searchParams.get('sort') || CREATED_DESCENDING;
    }, [searchParams]);

    const [sortType, setSortType] = useState<string>(getCurrentSortType());

    useEffect(() => {
        setSortType(getCurrentSortType());
    }, [searchParams])

    const handleSave = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', sortType.toLowerCase());
        params.set('page', DEFAULT_PAGE);
        
        router.push(`${pathname}?${params.toString()}`);
        setCollectionSortOpen(false);
    }, [searchParams, sortType, router, pathname, setCollectionSortOpen])

    return {
        sortType,
        setSortType,
        handleSave
    };
}

export default useCollectionSort