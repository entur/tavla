export async function getFilename(logoUrl: string) {
    const regex = /\/o\/logo%2F(.*?)\?alt=/

    const file = logoUrl.match(regex)

    if (!file || !file[1]) return

    return file[1]
}
