function filterMap<A, B>(
    arr: A[],
    mapper: (item: A, index: number, array: A[]) => B | undefined,
): B[] {
    return arr.reduce((acc: B[], item: A, index, array) => {
        const b = mapper(item, index, array)
        if (b === undefined) return acc
        return [...acc, b]
    }, [])
}

function unique<T>(
    array: T[],
    isEqual: (a: T, b: T) => boolean = (a, b): boolean => a === b,
): T[] {
    return array.filter((item, index, items) => {
        const previousItems = items.slice(0, index)
        return !previousItems.some((uniqueItem) => isEqual(item, uniqueItem))
    })
}

function toggleValueInList<T>(list: T[], item: T): T[] {
    if (list.includes(item)) {
        return list.filter((i) => i !== item)
    }
    return [...list, item]
}

export { filterMap, unique, toggleValueInList }
