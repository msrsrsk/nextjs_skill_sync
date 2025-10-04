import { useEffect, useState, useCallback } from "react"

import { GET_PRODUCTS_PAGE_TYPES, SITE_MAP } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SKILL_TRAIL } = GET_PRODUCTS_PAGE_TYPES;
const { PRODUCTS_API_PATH } = SITE_MAP;
const { PRODUCT_ERROR } = ERROR_MESSAGES;

const useSkillTrailData = (ids: string[]) => {
    const [products, setProducts] = useState<ProductWithReviewsAndPricing[] | null>(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {   
        fetchSkillTrailData();
    }, [ids]);

    const fetchSkillTrailData = useCallback(async () => {
        if (!ids || ids.length === 0) {
            setProducts(null);
            setLoading(false);
            return;
        }

        try {
            // throw new Error('test error');
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            ids.forEach(id => params.append('id', id));
            params.append('pageType', SKILL_TRAIL);

            const response = await fetch(`${PRODUCTS_API_PATH}?${params.toString()}`);
            const { success, data, message } = await response.json();

            if (success && data) {
                setProducts(data && data.length > 0 ? data : null);
                setError(null);
            } else {
                setProducts(null);
                setError(message);
            }
        } catch (error) {
            console.error('Hook Error - Skill Trail Data error:', error);
            setError(PRODUCT_ERROR.SKILL_TRAIL_FETCH_FAILED);
            setProducts(null);
        } finally {
            setLoading(false);
        }
    }, [ids])

    return {
        products,
        loading,
        error,
    };
}

export default useSkillTrailData