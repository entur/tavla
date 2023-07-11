import { useEffect, useState } from 'react'

function Clock() {
    const [currentTime, setCurrentTime] = useState<number | undefined>(
        undefined,
    )

    useEffect(() => {
        setCurrentTime(Date.now())
        const intervalId = setInterval(() => setCurrentTime(Date.now()), 1000)
        return () => clearInterval(intervalId)
    }, [])

    const time = new Intl.DateTimeFormat('no-NB', {
        timeStyle: 'short',
        timeZone: 'Europe/Oslo',
    }).format(currentTime)

    return <span>{currentTime ? time : 'kunne ikke hente tiden'}</span>
}

export { Clock }
