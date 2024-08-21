'use client'
import { useEffect, useState } from 'react'
import { formatTimeStamp } from 'utils/time'

function Clock() {
    const [currentTime, setCurrentTime] = useState<string>()

    useEffect(() => {
        setCurrentTime(formatTimeStamp(Date.now()))

        const intervalId = setInterval(
            () => setCurrentTime(formatTimeStamp(Date.now())),
            1000,
        )
        return () => clearInterval(intervalId)
    }, [])

    return <span className="text-[1.5625em] text-primary">{currentTime}</span>
}

export { Clock }
