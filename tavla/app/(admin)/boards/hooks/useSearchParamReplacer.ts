import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { useSearchParam } from './useSearchParam'

function useSearchParamReplacer(
    param: string,
): [string | undefined, (value?: string) => void] {
    const pathname = usePathname()
    const params = useSearchParams()
    const value = useSearchParam(param)

    const replace = useCallback(
        (value?: string) => {
            const newParams = new URLSearchParams(params ?? undefined)
            if (!value || value === '') newParams.delete(param)
            else newParams.set(param, value)
            window.history.replaceState(
                {},
                '',
                `${pathname}?${newParams.toString().replace(/%2C/g, ',')}`,
            )
        },
        [pathname, param, params],
    )
    return [value, replace]
}
export { useSearchParamReplacer }
