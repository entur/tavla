import { useSearchParams } from 'next/navigation'

function usePageParam(
    page: string,
): [boolean, boolean, string | null | undefined] {
    const params = useSearchParams()
    const open = params?.has(page) ?? false
    const pageParam = params?.get(page)
    const hasPage = page !== ''

    return [open, hasPage, pageParam]
}

export { usePageParam }
