export function formatWalkTrip(walkTrip: WalkTripType) {
    if (walkTrip.duration / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkTrip.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkTrip.duration / 60)} min å gå (${Math.ceil(
            walkTrip.walkDistance,
        )} m)`
    }
}
