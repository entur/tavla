import { Heading2 } from '@entur/typography'
import { useEffect, useState } from 'react'
import classes from './styles.module.css'

function Clock() {
    const [currentTime, setCurrentTime] = useState(Date.now())

    useEffect(() => {
        const intervalId = setInterval(() => setCurrentTime(Date.now()), 1000)
        return () => clearInterval(intervalId)
    }, [])

    const time = new Intl.DateTimeFormat('no-NB', {
        timeStyle: 'short',
    }).format(currentTime)

    return <Heading2 className={classes.clock}>{time}</Heading2>
}

export { Clock }
