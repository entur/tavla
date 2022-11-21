import { NonEmpty } from '../types'

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

function nonEmpty<A>(arr: A[]): NonEmpty<A> | undefined {
    if (arr[0]) return arr as NonEmpty<A>
    return undefined
}

function isEqualUnsorted<T>(array: T[], includes: T[]): boolean {
    if (array.length !== includes.length) return false
    return includes.every((i) => array.includes(i))
}

const arrayContains = (original: string[], contains: string[]): boolean =>
    original.some((r) => contains.indexOf(r) >= 0)

function toggleValueInList<T>(list: T[], item: T): T[] {
    if (list.includes(item)) {
        return list.filter((i) => i !== item)
    }
    return [...list, item]
}

export {
    filterMap,
    unique,
    nonEmpty,
    isEqualUnsorted,
    arrayContains,
    toggleValueInList,
}
