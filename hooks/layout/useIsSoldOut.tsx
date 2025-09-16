import { useMemo } from "react"

const useIsSoldOut = (stock: number) => {
    return useMemo(() => stock === 0, [stock])
}

export default useIsSoldOut