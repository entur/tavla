import { transportModeNames } from 'Admin/utils/transport'
import { TTransportMode } from 'types/graphql-schema'

export function isNotNullOrUndefined<T>(
    thing: T | undefined | null,
): thing is T {
    return thing !== undefined && thing !== null
}

export function fieldsNotNull<T extends Record<string, unknown>>(
    record: T | undefined,
): record is { [K in keyof T]: NonNullable<T[K]> } {
    return (
        isNotNullOrUndefined(record) &&
        Object.values(record).every(isNotNullOrUndefined)
    )
}

export function isNotNullOrUndefinedOrEmptyString<T>(
    thing: T | undefined | null,
): thing is T {
    return isNotNullOrUndefined(thing) && thing !== ''
}

function isArrayOfType<T>(
    thing: unknown[],
    typeGuard: (item: unknown) => item is T,
): thing is T[] {
    return thing.every(typeGuard)
}

function isTransportMode(thing: unknown): thing is TTransportMode {
    return transportModeNames[thing as TTransportMode] !== undefined
}

export function isTransportModeArray(
    thing: unknown,
): thing is TTransportMode[] {
    return Array.isArray(thing) && isArrayOfType(thing, isTransportMode)
}
