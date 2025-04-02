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
    spring: 'var(--data-visualization-spring)',
}

const colorValues = Object.values(dataColors)

export function colorsFromHash(name: string) {
    const index = Math.abs(hash(name)) % colorValues.length
    return colorValues[index]
}
