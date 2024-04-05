export function getFilename(logoUrl?: string) {
    if (!logoUrl) return ''
    const regex = /\/o\/logo%2F(.*?)\?alt=/

    const file = logoUrl.match(regex)

    if (!file || !file[1]) return ''

    return file[1]
}
export function containsSpecialChars(text: string) {
    const specialChars = /[^-_.\w]/g

    const matches = Array.from(text.matchAll(specialChars)).map(
        (match) => match[0],
    )

    const uniqueChars = new Set(matches)

    return {
        hasSpecialChars: matches.length !== 0,
        message: [...uniqueChars].join(','),
    }
}
