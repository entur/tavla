import { WalkIcon } from '@entur/icons'
import { TWalkingDistance } from 'types/tile'
import classes from './TableHeader/styles.module.css'
import { formatWalkTime } from 'app/(admin)/utils/time'

function WalkingDistance({
    walkingDistance,
}: {
    walkingDistance?: TWalkingDistance
}) {
    if (!walkingDistance?.visible || !walkingDistance?.distance) return null

    return (
        <div className={classes.duration}>
            <WalkIcon color="white" />
            {formatWalkTime(walkingDistance.distance)}
        </div>
    )
}

export { WalkingDistance }
