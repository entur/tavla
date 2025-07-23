import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

function useSearchParamsModal(param: string): [boolean, () => void] {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()

    const open = params?.has(param) ?? false

    const close = useCallback(() => {
        router.push(pathname ?? '/')
    }, [pathname, router])

    return [open, close]
}

export { useSearchParamsModal }
