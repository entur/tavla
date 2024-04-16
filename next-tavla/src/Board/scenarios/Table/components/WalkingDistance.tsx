import { WalkIcon } from '@entur/icons'
import { TWalkingDistance } from 'types/tile'
import { formatWalkTime } from 'app/(admin)/utils/time'

function WalkingDistance({
    walkingDistance,
}: {
    walkingDistance?: TWalkingDistance
}) {
    if (!walkingDistance?.visible || !walkingDistance?.distance) return null

    return (
        <div className="flex flex-row items-center whitespace-nowrap">
            <WalkIcon color="white" />
            {formatWalkTime(walkingDistance.distance)}
        </div>
    )
}

export { WalkingDistance }
