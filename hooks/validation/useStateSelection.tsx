import { useState, useCallback } from "react"

import { FORM_DEFAULT_STATE } from "@/constants/index"

const useStateSelection = () => {
    const [selectedState, setSelectedState] = useState(FORM_DEFAULT_STATE);

    const handleStateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedState(value);
    }, [])

    const resetSelectedState = useCallback(() => {
        setSelectedState(FORM_DEFAULT_STATE);
    }, [])

    return {
        selectedState,
        setSelectedState,
        handleStateChange,
        resetSelectedState,
    }
}

export default useStateSelection