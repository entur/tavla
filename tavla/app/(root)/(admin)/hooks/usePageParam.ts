import { useSearchParams } from 'next/navigation'

function usePageParam(page: string) {
    const params = useSearchParams()
    const open = params?.has(page) ?? false
    const pageParam = params?.get(page)
    const hasPage = pageParam ? true : false

    return { open, hasPage, pageParam }
}

export { usePageParam }
