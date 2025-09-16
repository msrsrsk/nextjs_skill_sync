"use client"

import { useEffect } from "react"

import useSkillTrailIds from "@/hooks/data/useSkillTrailIds"

const SkillTrailTracker = ({ productId }: { productId: ProductId }) => {
    const { error, addToSkillTrail } = useSkillTrailIds();
    
    useEffect(() => {
        addToSkillTrail(productId);
    }, [productId]);
    
    if (error) throw new Error(error);

    return null;
}

export default SkillTrailTracker