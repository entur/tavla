import { useEffect, useState } from 'react'
import classes from './styles.module.css'
import { formatTimeStamp } from 'utils/time'

function Clock() {
    const [currentTime, setCurrentTime] = useState(0)

    useEffect(() => {
        const intervalId = setInterval(() => setCurrentTime(Date.now()), 1000)
        return () => clearInterval(intervalId)
    }, [])

    const time = formatTimeStamp(currentTime)

    return <span className={classes.clock}>{time}</span>
}

export { Clock }
