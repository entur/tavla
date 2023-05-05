import type { TravelSwitchProps } from '@entur/form'

export function isNotNullOrUndefined<T>(
    thing: T | undefined | null,
): thing is T {
    return thing !== undefined && thing !== null
}

// Type guard for record with only defined fields (non-recursive)
export function fieldsNotNull<T extends Record<string, unknown>>(
    record: T | undefined,
): record is { [K in keyof T]: NonNullable<T[K]> } {
    return (
        isNotNullOrUndefined(record) &&
        Object.values(record).every(isNotNullOrUndefined)
    )
}

export function isTransport(
    mode: string,
): mode is TravelSwitchProps['transport'] {
    return [
        'bus',
        'rail',
        'water',
        'air',
        'tram',
        'bike',
        'metro',
        'scooter',
        'airportLinkRail',
        'airportLinkBus',
    ].includes(mode)
}
