import { LOADING_SPINNER_SIZES } from "@/constants/index"

const { LOADING_SMALL, LOADING_MEDIUM } = LOADING_SPINNER_SIZES;

interface LoadingSpinnerProps {
    customClass?: string;
    size?: LoadingSpinnerSizeType;
}

const LoadingSpinner = ({ 
    customClass,
    size = LOADING_MEDIUM
}: LoadingSpinnerProps) => {
    return (
        <div 
            className={`grid place-items-center${
                size === LOADING_MEDIUM ? " min-h-[160px]" : ""}${
                customClass ? ` ${customClass}` : ''
            }`}
            aria-label="読み込み中..."
        >
            <div className="loading-box">
                <div className={`relative${
                    size === LOADING_SMALL ? " w-[28px] h-[28px] md:w-[32px] md:h-[32px]" : " w-[37px] h-[37px] md:w-[40px] md:h-[40px]"
                }`}>
                    <div className="absolute inset-0 border-4 border-[var(--main)]/20 rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                    <div className="absolute inset-0 border-4 border-t-[var(--main)] border-transparent rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingSpinner;