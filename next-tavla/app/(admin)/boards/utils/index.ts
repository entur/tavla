function hash(seq: string) {
    let hash = 0
    for (let i = 0; i < seq.length; i++) {
        const char = seq.charCodeAt(i)
        hash = (hash << 5) - hash + char
    }
    return hash
}

const colors = [
    '#181C56', // Blue
    '#FF5959', // Coral
    '#0EA2A8', // Jungle
    '#2F98FA', // Azure
    '#8692CA', // Lavender
    '#CA825B', // Peach
    '#57A257', // Spring
    '#8E57E3', // Lilac
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
