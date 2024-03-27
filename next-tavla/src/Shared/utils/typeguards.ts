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
