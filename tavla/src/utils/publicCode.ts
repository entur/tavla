const regex = /AVI:ServiceJourney:([A-Z0-9]+)-\d{2}-\d+/

export function getAirPublicCode(id: string) {
    const match = id.match(regex)
    return match ? match[1] : undefined
}
