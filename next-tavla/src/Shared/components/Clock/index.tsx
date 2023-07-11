import { useEffect, useState } from 'react'

function Clock() {
    const [currentTime, setCurrentTime] = useState(Date.now())

    useEffect(() => {
        const intervalId = setInterval(() => setCurrentTime(Date.now()), 1000)
        return () => clearInterval(intervalId)
    }, [])

    const time = new Intl.DateTimeFormat('no-NB', {
        timeStyle: 'short',
        timeZone: 'Europe/Oslo',
    }).format(currentTime)

    return <span suppressHydrationWarning>{time}</span>
}

export { Clock }
