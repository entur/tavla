import { useEffect, useState } from 'react'
import classes from './styles.module.css'
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

    return <span className={classes.clock}>{currentTime}</span>
}

export { Clock }
