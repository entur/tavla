export function getFilename(logoUrl?: string) {
    if (!logoUrl) return ''
    const regex = /\/o\/logo%2F(.*?)\?alt=/

    const file = logoUrl.match(regex)

    if (!file || !file[1]) return ''

    return file[1]
}
