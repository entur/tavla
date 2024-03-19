import { WalkIcon } from '@entur/icons'
import classes from './styles.module.css'
import { formatWalkTime } from 'Admin/utils/time'

function TableHeader({
    heading,
    duration,
}: {
    heading: string
    duration?: Long
}) {
    return (
        <div className={classes.tableHeaderWrapper}>
            <h1 className={classes.heading}>{heading}</h1>
            {duration && (
                <div className={classes.duration}>
                    <WalkIcon color="white" />
                    {formatWalkTime(Number(duration))}
                </div>
            )}
        </div>
    )
}

export { TableHeader }
