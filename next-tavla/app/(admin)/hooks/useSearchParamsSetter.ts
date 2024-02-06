import { TLoginPage } from 'Admin/types/login'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

function useSearchParamsSetter<T>(parameter: string) {
    const pathname = usePathname()
    const params = useSearchParams()

    const getPathWithParams = useCallback(
        (page: T) => {
            const newParams = new URLSearchParams(params ?? undefined)
            newParams.set(parameter, String(page))

            return pathname + '?' + newParams.toString()
        },
        [params, pathname, parameter],
    )

    return getPathWithParams
}

export { useSearchParamsSetter }
