import { DebouncedFunc, debounce } from 'lodash'
import { useRef, useCallback } from 'react'

type FetchFunction<T, U> = (input: T) => Promise<U>

export function useDebouncedFetch<T, U>(
    delay: number,
    fetchFunction: FetchFunction<T, U>,
) {
    const debouncedCallRef = useRef<DebouncedFunc<() => Promise<U>>>()

    const debouncedCallback = useCallback(
        (input: T) => {
            debouncedCallRef.current && debouncedCallRef.current.cancel()
            return new Promise<U>((resolve) => {
                debouncedCallRef.current = debounce(
                    async () => resolve(await fetchFunction(input)),
                    delay,
                ) as DebouncedFunc<() => Promise<U>>
                debouncedCallRef.current()
            })
        },
        [debouncedCallRef, delay, fetchFunction],
    )

    return debouncedCallback
}
