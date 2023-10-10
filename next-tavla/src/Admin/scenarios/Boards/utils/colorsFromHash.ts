function hash(seq: string) {
    const first = seq.charCodeAt(0)
    const last = seq.charCodeAt(seq.length - 1)
    const coefficient = first << last
    return seq
        .split('')
        .reduce((acc, curr) => acc + curr.charCodeAt(0) * coefficient, 0)
}

export const colorsFromHash = (
    name: string,
    saturation?: number,
    lightness?: number,
) => {
    return `hsl(${hash(name) % 360}, ${saturation ?? 80}%, ${lightness ?? 40}%)`
}
