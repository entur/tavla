function hash(seq: string) {
    let hash = 0
    for (let i = 0; i < seq.length; i++) {
        const char = seq.charCodeAt(i)
        hash = (hash << 5) - hash + char
    }
    return hash
}

const colors = [
    'var(--data-visualization-blue)', // Blue
    'var(--data-visualization-coral)', // Coral
    'var(--data-visualization-jungle)', // Jungle
    'var(--data-visualization-azure)', // Azure
    'var(--data-visualization-lavender)', // Lavender
    'var(--data-visualization-peach)', // Peach
    'var(--data-visualization-spring)', // Spring
    'var(--data-visualization-lilac)', // Lilac
]

export function colorsFromHash(name: string) {
    const index = Math.abs(hash(name)) % colors.length
    return colors[index]
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
