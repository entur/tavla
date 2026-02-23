const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tavla.entur.no'

export default function sitemap() {
    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}/demo`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}/hjelp`,
            lastModified: new Date().toISOString(),
        },
        {
            url: `${baseUrl}/personvern`,
            lastModified: new Date().toISOString(),
        },
    ]
}
