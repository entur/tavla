import { WalkIcon } from '@entur/icons'
import classes from './styles.module.css'
import { formatWalkTime } from 'Admin/utils/time'
import { TWalkingDistance } from 'types/tile'

function TableHeader({
    heading,
    walkingDistance,
}: {
    heading: string
    walkingDistance?: TWalkingDistance
}) {
    return (
        <div className={classes.tableHeaderWrapper}>
            <h1 className={classes.heading}>{heading}</h1>
            {walkingDistance?.visible && walkingDistance.distance && (
                <div className={classes.duration}>
                    <WalkIcon color="white" />
                    {formatWalkTime(walkingDistance.distance)}
                </div>
            )}
        </div>
    )
}

export { TableHeader }
