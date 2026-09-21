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

export function typedEntries<T extends object>(
    obj: T,
): [keyof T, T[keyof T]][] {
    return Object.entries(obj) as [keyof T, T[keyof T]][]
}

export function typedKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[]
}

export function hasField<T, K extends keyof T>(
    obj: T,
    key: K,
): obj is T & Record<K, NonNullable<T[K]>> {
    return obj[key] !== null && obj[key] !== undefined
}

/**
 * Returns a copy of an object without properties whose values are `undefined`.
 *
 * Firestore rejects explicit `undefined` values, including in `arrayUnion`
 * payloads.
 *
 * @template T - The type of the input object.
 * @param obj - The object to remove `undefined` values from.
 * @returns A shallow copy of `obj` without `undefined`-valued properties.
 */
export function omitUndefinedValues<T extends object>(obj: T): T {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value !== undefined),
    ) as T
}
