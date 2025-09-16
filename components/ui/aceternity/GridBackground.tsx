import { cn } from "@/lib/utils/cn";

interface GridBackgroundProps {
    children?: React.ReactNode
    height?: string
    customClass?: string
}

const GridBackground = ({ 
    children, 
    height = "h-[346px] md:h-[440px]",
    customClass = ""
}: GridBackgroundProps) => {
    return (
        <div className={cn("flex w-full items-center justify-center", customClass, height)}>
            <div
                className={cn(
                    "absolute inset-0",
                    "[background-size:40px_40px]",
                    "[background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]",
                    "dark:[background-image:linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]",
                )}
            />
            <div 
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"
            />
            <div className="relative">
                {children}
            </div>
        </div>
    )
}

export default GridBackground