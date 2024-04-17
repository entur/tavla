import { WalkIcon } from '@entur/icons'
import { TWalkingDistance } from 'types/tile'
import { formatWalkTime } from 'app/(admin)/utils/time'

function WalkingDistance({
    walkingDistance,
}: {
    walkingDistance?: TWalkingDistance
}) {
    if (!walkingDistance?.visible) return null

    return (
        <div className="flexRow alignCenter nowrap">
            <WalkIcon color="white" />
            {formatWalkTime(walkingDistance.distance)}
        </div>
    )
}

export { WalkingDistance }
