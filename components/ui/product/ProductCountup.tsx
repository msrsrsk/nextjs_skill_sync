"use client"

import CountUp from "react-countup"
import { Earth } from "lucide-react"

const ProductCountup = ({ syncNum }: { syncNum: number }) => {
    return (
        <div className="flex items-center gap-3">
            <Earth className="w-6 h-6" strokeWidth={2} />
            <CountUp 
                start={0}
                end={syncNum} 
                duration={2.7} 
                separator="," 
                redraw={false}
                className="text-2xl font-poppins font-semibold leading-none" 
            />
        </div>
    )
}

export default ProductCountup