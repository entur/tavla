import { TLoginPage } from 'Admin/types/login'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

function useLoginPath() {
    const pathname = usePathname()
    const params = useSearchParams()

    const getPath = useCallback(
        (page: TLoginPage) => {
            const newParams = new URLSearchParams(params ?? undefined)
            newParams.set('login', page)

            return pathname + '?' + newParams.toString()
        },
        [params, pathname],
    )

    return getPath
}

export { useLoginPath }
