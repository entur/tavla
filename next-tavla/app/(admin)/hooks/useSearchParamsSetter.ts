import { TLoginPage } from 'Admin/types/login'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

function useSearchParamsSetter(parameter: string) {
    const pathname = usePathname()
    const params = useSearchParams()

    const getPathWithParams = useCallback(
        (page: TLoginPage) => {
            const newParams = new URLSearchParams(params ?? undefined)
            newParams.set(parameter, page)

            return pathname + '?' + newParams.toString()
        },
        [params, pathname, parameter],
    )

    return getPathWithParams
}

export { useSearchParamsSetter }
