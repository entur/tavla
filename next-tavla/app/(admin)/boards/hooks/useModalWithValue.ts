import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

function useModalWithValue(modal: string, value: string) {
    const params = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const validId = params?.get(modal) === value
    const isOpen = (params?.has(modal) && validId) ?? false

    const open = useCallback(() => {
        const newParams = new URLSearchParams(params ?? undefined)
        newParams.set(modal, value)
        router.push(`${pathname}?${newParams.toString()}`)
    }, [router, pathname, params, modal, value])

    const close = useCallback(() => {
        const newParams = new URLSearchParams(params ?? undefined)
        newParams.delete(modal)
        router.push(`${pathname}?${newParams.toString()}`)
    }, [router, pathname, params, modal])

    return { isOpen, open, close }
}
export { useModalWithValue }
