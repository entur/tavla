import { useEffect, useState } from 'react'

function useCycler<T>(array: T[] | undefined, step = 5000) {
    const [index, setIndex] = useState(0)

    const length = array?.length ?? 0

    useEffect(() => {
        if (length <= 1) {
            return
        }
        const interval = setInterval(
            () => setIndex((i) => (i + 1) % length),
            step,
        )
        return () => clearInterval(interval)
    }, [length, step])
    return index
}

export { useCycler }
