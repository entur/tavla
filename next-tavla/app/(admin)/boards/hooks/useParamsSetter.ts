import { DEFAULT_BOARD_COLUMNS } from 'Admin/types/boards'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export function useParamsSetter() {
    const searchParams = useSearchParams()
    const params = useMemo(
        () => new URLSearchParams(searchParams ?? undefined),
        [searchParams],
    )
    const router = useRouter()
    const pathname = usePathname()

    const setQuery = useCallback(
        (key: string, value: string) => {
            params.set(key, value)
            router.push(pathname + '?' + params.toString())
        },
        [router, pathname, params],
    )

    const deleteQuery = useCallback(
        (key: string) => {
            params.delete(key)
            router.push(`${pathname}?${params.toString()}`)
        },
        [router, pathname, params],
    )

    const updateQuery = useCallback(
        (key: string, value: string) => {
            const queryList = params.get(key)?.split(',') ?? []
            if (queryList.includes(value)) {
                params.delete(key)
                if (queryList.length > 0) {
                    params.set(
                        key,
                        queryList.filter((v) => v !== value).join(','),
                    )
                }
            } else if (params.has(key)) {
                params.delete(key)
                params.set(key, queryList.concat(value).join(','))
            } else {
                params.set(key, value)
            }

            if (
                params.get(key) === '' ||
                (key === 'columns' &&
                    params.get(key) === DEFAULT_BOARD_COLUMNS.join(','))
            )
                params.delete(key)

            const queryString = Array.from(params.entries())
                .map(([key, value]) => `${key}=${value}`)
                .join('&')

            router.push(`${pathname}?${queryString}`)
        },
        [router, pathname, params],
    )

    return {
        updateQuery,
        setQuery,
        deleteQuery,
    }
}
