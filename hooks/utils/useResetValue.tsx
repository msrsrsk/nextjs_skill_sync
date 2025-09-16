import { useEffect } from "react"

interface ResetValueProps {
    watchValue: boolean;
    resetFunctions: (() => void)[];
}

const useResetValue = ({
    watchValue, 
    resetFunctions, 
}: ResetValueProps) => {
    useEffect(() => {
        return () => {
            resetFunctions.forEach(resetFn => {
                if (typeof resetFn === 'function') {
                    resetFn();
                }
            });
        };
    }, [watchValue]);
}

export default useResetValue