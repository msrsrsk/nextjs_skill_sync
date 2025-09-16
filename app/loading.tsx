export default function Loading () {
    return (
        <div 
            className="w-screen h-screen grid place-items-center"
            aria-label="読み込み中..."
        >
            <div className="loading-box">
                <div className="relative w-[37px] h-[37px]">
                    <div className="absolute inset-0 border-4 border-[var(--main)]/20 rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                    <div className="absolute inset-0 border-4 border-t-[var(--main)] border-transparent rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                </div>
            </div>
        </div>
    )
}