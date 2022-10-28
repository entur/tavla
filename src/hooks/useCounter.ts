import { useEffect, useState } from 'react'

function useCounter(interval = 1000): number {
    const [tick, setTick] = useState<number>(0)

    useEffect(() => {
        const timerID = setInterval(() => {
            setTick(tick + 1)
        }, interval)
        return (): void => clearInterval(timerID)
    }, [interval, tick])

    return tick
}

export { useCounter }
