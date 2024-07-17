function hash(seq: string) {
    let hash = 0
    for (let i = 0; i < seq.length; i++) {
        const char = seq.charCodeAt(i)
        hash = (hash << 5) - hash + char
    }
    return hash
}

export const dataColors = {
    azure: 'var(--data-visualization-azure)',
    blue: 'var(--data-visualization-blue)',
    coral: 'var(--data-visualization-coral)',
    jungle: 'var(--data-visualization-jungle)',
    lavender: 'var(--data-visualization-lavender)',
    lilac: 'var(--data-visualization-lilac)',
    peach: 'var(--data-visualization-peach)',
    spring: 'var(--data-visualization-spring)',
}

const colorValues = Object.values(dataColors)

export function colorsFromHash(name: string) {
    const index = Math.abs(hash(name)) % colorValues.length
    return colorValues[index]
}

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
