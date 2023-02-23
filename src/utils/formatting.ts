import { WalkTrip } from 'src/types'

export function formatWalkTrip(walkTrip: WalkTrip) {
    if (walkTrip.duration / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkTrip.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkTrip.duration / 60)} min å gå (${Math.ceil(
            walkTrip.walkDistance,
        )} m)`
    }
}
