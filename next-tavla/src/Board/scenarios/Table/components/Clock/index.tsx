import { Heading2 } from '@entur/typography'
import { useEffect, useState } from 'react'

function Clock() {
    const [currentTime, setCurrentTime] = useState(Date.now())

    useEffect(() => {
        const intervalId = setInterval(() => setCurrentTime(Date.now()), 1000)
        return () => clearInterval(intervalId)
    }, [])

    const time = new Intl.DateTimeFormat('no-NB', {
        timeStyle: 'short',
    }).format(currentTime)

    return (
        <div>
            <Heading2>{time}</Heading2>
        </div>
    )
}

export { Clock }
