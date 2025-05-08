import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

type QueryKeys = 'opprett' | 'flytt' | 'slett' | 'id'

interface QueryParam {
    key: QueryKeys
    value: string
}

function useModalWithValues(...queryParams: QueryParam[]) {
    const params = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    let validId = false
    let isOpen = true
    for (const queryParam of queryParams) {
        validId = params?.get(queryParam.key) === queryParam.value

        isOpen = isOpen && ((params?.has(queryParam.key) && validId) ?? false)
    }

    const open = useCallback(() => {
        const newParams = new URLSearchParams(params ?? undefined)
        for (const queryParam of queryParams) {
            newParams.set(queryParam.key, queryParam.value)
        }
        router.push(`${pathname}?${newParams.toString()}`)
    }, [router, pathname, params, queryParams])

    const close = useCallback(() => {
        const newParams = new URLSearchParams(params ?? undefined)
        for (const queryParam of queryParams) {
            newParams.delete(queryParam.key)
        }
        router.push(`${pathname}?${newParams.toString()}`)
    }, [router, pathname, params, queryParams])

    return { isOpen, open, close }
}

export { useModalWithValues }
