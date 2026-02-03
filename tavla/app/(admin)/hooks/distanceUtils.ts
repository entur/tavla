/**
 * Coordinate type used throughout the application
 */
export type Coordinate = {
    lat: number
    lng: number
}

/**
 * Calculate the Haversine distance between two coordinates in meters
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in meters
 */
export function calculateDistance(
    coord1: Coordinate,
    coord2: Coordinate,
): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (coord1.lat * Math.PI) / 180
    const φ2 = (coord2.lat * Math.PI) / 180
    const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180
    const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
}

/**
 * Calculate bounding box coordinates for a given center and radius
 * @param center Center coordinate
 * @param radiusMeters Radius in meters
 * @returns Bounding box with min/max lat/lng
 */
export function calculateBoundingBox(center: Coordinate, radiusMeters: number) {
    // 1 degree of latitude = ~111 km
    // 1 degree of longitude = ~111 km * cos(latitude)
    const latOffset = radiusMeters / 111000
    const lngOffset =
        radiusMeters / (111000 * Math.cos((center.lat * Math.PI) / 180))

    return {
        minLat: center.lat - latOffset,
        maxLat: center.lat + latOffset,
        minLng: center.lng - lngOffset,
        maxLng: center.lng + lngOffset,
    }
}

/**
 * Sort stop places by distance from center coordinate
 * @param stopPlaces Array of stop places with coordinates
 * @param centerCoord Center coordinate
 * @returns Array sorted by distance (nearest first)
 */
export function sortByDistance<
    T extends { latitude: number | null; longitude: number | null },
>(stopPlaces: T[], centerCoord: Coordinate): { item: T; distance: number }[] {
    return stopPlaces
        .filter((sp) => sp.latitude !== null && sp.longitude !== null)
        .map((sp) => ({
            item: sp,
            distance: calculateDistance(centerCoord, {
                lat: sp.latitude!,
                lng: sp.longitude!,
            }),
        }))
        .sort((a, b) => a.distance - b.distance)
}

/**
 * Format distance for display
 * @param meters Distance in meters
 * @returns Formatted string like "150m" or "1.2km"
 */
export function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `${Math.round(meters)}m`
    }
    return `${(meters / 1000).toFixed(1)}km`
}
