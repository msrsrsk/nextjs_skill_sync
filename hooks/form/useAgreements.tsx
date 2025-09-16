import { useState, useCallback, useMemo } from "react"

const useAgreements = ({ checkList }: { checkList: { id: string }[] }) => {
    const [agreements, setAgreements] = useState<{ [key: string]: boolean }>({})

    const handleAgreementChange = useCallback((id: string) => {
        setAgreements(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    }, [])

    const isAllChecked = useMemo(() => 
        checkList.every(list => agreements[list.id]), 
        [checkList, agreements]
    )

    const resetAgreements = useCallback(() => {
        setAgreements({});
    }, [])

    return {
        agreements,
        handleAgreementChange,
        isAllChecked,
        resetAgreements,
    }
}

export default useAgreements