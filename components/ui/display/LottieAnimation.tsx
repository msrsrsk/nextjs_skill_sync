"use client"

import Lottie from "lottie-react"

interface LottieAnimationData {
    v: string;
    fr: number;
    ip: number;
    op: number;
    w: number;
    h: number;
    nm: string;
    ddd: number;
    assets: unknown[];
    layers: unknown[];
    [key: string]: unknown;
}

interface LottieAnimationProps {
    data: LottieAnimationData
    autoplay?: boolean
    loop?: boolean
    customClass?: string
}

const LottieAnimation = ({ 
    data, 
    autoplay = true, 
    loop = true, customClass 
}: LottieAnimationProps) => {
    return (
        <Lottie 
            animationData={data} 
            autoplay={autoplay}
            loop={loop} 
            className={customClass} 
        />
    )
}

export default LottieAnimation