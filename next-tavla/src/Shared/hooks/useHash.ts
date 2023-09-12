import { useRouter } from 'next/router'

function useHashState(id: string) {
    const router = useRouter()
    const hash = router.asPath.split('#')[1] ?? ''
    const isOpen = hash === id
    const open = () => {
        router.push({
            query: { ...router.query },
            pathname: router.pathname,
            hash: id,
        })
    }
    const close = () => {
        router.push({
            query: { ...router.query },
            pathname: router.pathname,
            hash: '',
        })
    }
    return { isOpen, open, close }
}

export { useHashState }
