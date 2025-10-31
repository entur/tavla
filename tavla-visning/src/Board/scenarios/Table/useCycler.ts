import { useEffect, useState } from 'react'

/**
 * Custom React hook that cycles through the indices of a given array at a specified interval.
 *
 * @param {T[] | undefined} array - The array to cycle through. If undefined or has length <= 1, cycling is disabled.
 * @param {number} [step=5000] - The interval in milliseconds between each cycle.
 * @returns {number} The current index in the array.
 *
 * @remarks
 * - The hook uses `useState` to track the current index and `useEffect` to set up an interval for cycling.
 * - If the array is undefined or has one or fewer elements, the cycling interval is not set.
 * - The index wraps around to the start of the array when it reaches the end.
 *
 * @example
 * ```tsx
 * const items = ['A', 'B', 'C'];
 * const currentIndex = useCycler(items, 2000);
 * // currentIndex will update every 2 seconds, cycling through 0, 1, 2
 * ```
 */
export function useCycler<T>(array: T[] | undefined, step = 5000) {
    const [index, setIndex] = useState(0)

    const length = array?.length ?? 0

    useEffect(() => {
        if (length <= 1) {
            return
        }
        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % length)
        }, step)
        return () => clearInterval(interval)
    }, [length, step])

    // Reset index if array length changes and current index is out of bounds
    useEffect(() => {
        // Avoid unnecessary state update when length is 0 and index already 0
        if (length === 0) {
            if (index !== 0) {
                setIndex(0)
            }
            return
        }
        if (index >= length) {
            setIndex(0)
        }
    }, [length, index])

    return index
}
