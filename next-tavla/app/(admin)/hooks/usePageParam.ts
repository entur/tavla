import { useSearchParams } from 'next/navigation'

function usePageParam(page: string) {
    const params = useSearchParams()
    const open = params?.has(page) ?? false
    const pageParam = params?.get(page)
    const hasPage = page !== ''

    return { open, hasPage, pageParam }
}

export { usePageParam }
