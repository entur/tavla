import { WalkIcon } from '@entur/icons'
import { formatWalkTime } from 'Admin/utils/time'
import { TWalkingDistance } from 'types/tile'
import classes from './TableHeader/styles.module.css'

function WalkingDistance({
    walkingDistance,
}: {
    walkingDistance?: TWalkingDistance
}) {
    if (walkingDistance?.visible && walkingDistance.distance)
        return (
            <div className={classes.duration}>
                <WalkIcon color="white" />
                {formatWalkTime(walkingDistance.distance)}
            </div>
        )
    return null
}

export { WalkingDistance }
