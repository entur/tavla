import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

function useSearchParam(param: string) {
    const params = useSearchParams()
    const [value, setValue] = useState(params?.get(param) ?? undefined)
    useEffect(() => {
        setValue(params?.get(param) ?? undefined)
    }, [params, param])
    return value
}

export { useSearchParam }
