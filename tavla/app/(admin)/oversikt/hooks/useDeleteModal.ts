import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

function useDeleteModal(modal: string, id: string) {
    const params = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const validId = params?.get('id') === id
    const isOpen = (params?.has('slett') && validId) ?? false

    const open = useCallback(() => {
        const newParams = new URLSearchParams(params ?? undefined)
        newParams.set('id', id)
        router.push(`${pathname}?slett=${modal}&${newParams.toString()}`)
    }, [router, pathname, params, modal, id])

    const close = useCallback(() => {
        const newParams = new URLSearchParams(params ?? undefined)
        newParams.delete('id')
        newParams.delete('slett')
        router.push(`${pathname}?${newParams.toString()}`)
    }, [router, pathname, params])

    return { isOpen, open, close }
}
export { useDeleteModal }
