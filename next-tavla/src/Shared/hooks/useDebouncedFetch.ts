import { useRef, useCallback } from 'react'

export function useDebouncedFetch<T, U>(
    delay: number,
    fetchFunction: (input: T) => Promise<U>,
) {
    const debouncedCallRef = useRef<number>()

    const debouncedCallback = useCallback(
        (input: T) => {
            debouncedCallRef.current && clearTimeout(debouncedCallRef.current)
            return new Promise<U>((resolve) => {
                debouncedCallRef.current = window.setTimeout(async () => {
                    resolve(await fetchFunction(input))
                }, delay)
            })
        },
        [debouncedCallRef, delay, fetchFunction],
    )

    return debouncedCallback
}
