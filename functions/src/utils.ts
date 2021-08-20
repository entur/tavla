export const extractPathFromUrl = (url: string): string => {
    const PATH_REGEX = /(images.*\??)(?=\?)/gi
    const matches = url.match(PATH_REGEX)
    if (!matches) {
        throw new Error('Image path could not be found')
    }
    const rawPath = matches[0]
    const path = rawPath.replace('%', '/')
    return path
}
