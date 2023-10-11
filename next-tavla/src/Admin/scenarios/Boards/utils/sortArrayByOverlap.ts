export function sortArrayByOverlap<T>(toBeSorted: T[], overlapArray: T[]): T[] {
    const overlapSet = new Set(overlapArray)

    return toBeSorted.sort((a, b) => {
        const aInOverlap = overlapSet.has(a)
        const bInOverlap = overlapSet.has(b)

        if (aInOverlap && !bInOverlap) {
            return -1
        } else if (!aInOverlap && bInOverlap) {
            return 1
        }
        return 0
    })
}
