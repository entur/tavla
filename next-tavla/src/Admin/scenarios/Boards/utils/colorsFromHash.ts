export const colorsFromHash = (
    name: string,
    saturation?: number,
    lightness?: number,
) => {
    const hashNumber = name
        .toLowerCase()
        .split('')
        .map((char) => char.charCodeAt(0))
        .reduce((a, b) => a * 23 + b * 31, 0)

    return `hsl(${hashNumber % 360}, ${saturation ?? 80}%, ${lightness ?? 40}%)`
}
