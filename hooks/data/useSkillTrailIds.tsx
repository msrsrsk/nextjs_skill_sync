import { useState, useEffect, useCallback } from "react"

import { STORAGE_KEYS, PRODUCTS_DISPLAY_CONFIG } from "@/constants/index"
import { ERROR_MESSAGES } from "@/constants/errorMessages"

const { SKILL_TRAIL_KEY } = STORAGE_KEYS;
const { OPTIMAL_SYNCS_LIMIT } = PRODUCTS_DISPLAY_CONFIG;
const { PRODUCT_ERROR } = ERROR_MESSAGES;

const useSkillTrailIds = () => {
    const [ids, setIds] = useState<ProductId[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getStoredSkillTrail = useCallback((): ProductId[] => {
        try {
            const storedSkillTrail = localStorage.getItem(SKILL_TRAIL_KEY);
            return storedSkillTrail ? JSON.parse(storedSkillTrail) : [];
        } catch (error) {
            console.error('Hook Error - Parse Skill Trail error:', error);
            return [];
        }
    }, []);

    const setStoredSkillTrail = useCallback((trail: ProductId[]) => {
        try {
            localStorage.setItem(SKILL_TRAIL_KEY, JSON.stringify(trail));
            setIds(trail);
        } catch (error) {
            console.error('Hook Error - Set Skill Trail error:', error);
            setError(PRODUCT_ERROR.ADD_SKILL_TRAIL_FAILED);
        }
    }, []);

    const addToSkillTrail = useCallback((productId: ProductId) => {
        setError(null);

        const currentTrail = getStoredSkillTrail();
        const filteredTrail = currentTrail.filter(id => id !== productId);
        const newTrail = [productId, ...filteredTrail].slice(0, OPTIMAL_SYNCS_LIMIT);
        
        setStoredSkillTrail(newTrail);
    }, [getStoredSkillTrail, setStoredSkillTrail]);

    const getSkillTrail = useCallback(() => {
        setLoading(true);
        setError(null);

        try {
            const trail = getStoredSkillTrail();
            setIds(trail);
        } catch (error) {
            console.error('Hook Error - Get Skill Trail Data error:', error);
            setError(PRODUCT_ERROR.SKILL_TRAIL_FETCH_FAILED);
        } finally {
            setLoading(false);
        }
    }, [getStoredSkillTrail]);

    const clearSkillTrail = useCallback(() => {
        setLoading(true);
        setError(null);

        try {
            localStorage.removeItem(SKILL_TRAIL_KEY);
            setIds([]);
        } catch (error) {
            console.error('Hook Error - Clear Skill Trail error:', error);
            setError(PRODUCT_ERROR.DELETE_SKILL_TRAIL_FAILED);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getSkillTrail();
    }, [getSkillTrail]);

    return {
        ids,
        loading,
        error,
        addToSkillTrail,
        getSkillTrail,
        clearSkillTrail
    }
}

export default useSkillTrailIds