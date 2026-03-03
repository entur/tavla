import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/demo', '/hjelp', '/personvern'],
                disallow: ['/oversikt', '/tavler/', '/api/'],
            },
        ],
        sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://tavla.entur.no'}/sitemap.xml`,
    }
}
