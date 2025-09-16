import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

import { DEFAULT_PAGE } from "@/constants/index"

interface UseCollectionFilterProps {
    priceBounds: ProductPriceBounds;
    setCollectionFilterOpen: (open: boolean) => void;
}

const useCollectionFilter = ({ 
    priceBounds, 
    setCollectionFilterOpen 
}: UseCollectionFilterProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getCurrentPriceRange = useCallback((): [number, number] => {
        const minPrice = parseInt(searchParams.get('minPrice') || priceBounds.minPrice.toString());
        const maxPrice = parseInt(searchParams.get('maxPrice') || priceBounds.maxPrice.toString());
        return [minPrice, maxPrice];
    }, [searchParams, priceBounds]);

    const getCurrentStockState = useCallback((): boolean => {
        return searchParams.get('isStock') === 'true';
    }, [searchParams]);

    const [isStock, setIsStock] = useState(getCurrentStockState);
    const [priceRange, setPriceRange] = useState<[number, number]>(getCurrentPriceRange);

    useEffect(() => {
        setPriceRange(getCurrentPriceRange());
        setIsStock(getCurrentStockState());
    }, [searchParams]);

    const handlePriceChange = useCallback((newRange: [number, number]) => {
        setPriceRange(newRange);
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams.toString());
        params.set('minPrice', priceRange[0].toString());
        params.set('maxPrice', priceRange[1].toString());
        params.set('isStock', isStock.toString());
        params.set('page', DEFAULT_PAGE);
        
        router.push(`${pathname}?${params.toString()}`);
        setCollectionFilterOpen(false);
    };

    return {
        isStock,
        setIsStock,
        priceRange,
        handlePriceChange,
        handleSave
    };
}

export default useCollectionFilter