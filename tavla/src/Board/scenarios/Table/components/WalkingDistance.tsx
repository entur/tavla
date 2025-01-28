import { WalkIcon } from '@entur/icons'
import { TWalkingDistance } from 'types/tile'
import { formatWalkTime } from 'app/(admin)/utils/time'

function WalkingDistance({
    walkingDistance,
}: {
    walkingDistance?: TWalkingDistance
}) {
    if (!walkingDistance || walkingDistance.visible == false) return null

    return (
        <div className="flex flex-row items-center whitespace-nowrap">
            <WalkIcon color="primary" />
            {formatWalkTime(walkingDistance.distance)}
        </div>
    )
}

export { WalkingDistance }
