import { format } from 'date-fns'
import { WalkTrip } from 'types/structs'

export function formatWalkTrip(walkTrip: WalkTrip) {
    if (walkTrip.duration / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkTrip.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkTrip.duration / 60)} min å gå (${Math.ceil(
            walkTrip.walkDistance,
        )} m)`
    }
}

export function formatDepartureTime(
    minDiff: number,
    departureTime: Date,
): string {
    if (minDiff > 15) return format(departureTime, 'HH:mm')
    return minDiff < 1 ? 'Nå' : `${minDiff} min`
}
