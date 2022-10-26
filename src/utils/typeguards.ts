function isNotNullOrUndefined<T>(thing: T | undefined | null): thing is T {
    return thing !== undefined && thing !== null
}

export { isNotNullOrUndefined }
