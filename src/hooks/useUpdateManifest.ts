import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const useUpdateManifest = () => {
    const location = useLocation()

    useEffect(() => {
        const href = window.location.href
        const origin = window.location.origin
        const manifest = window.document.getElementById('manifest-placeholder')
        if (manifest) {
            const dynamicManifest = {
                name: 'Tavla - Enturs avgangstavle',
                short_name: 'Tavla',
                start_url: `${href}`,
                scope: `${href}`,
                display: 'standalone',
                background_color: '#181C56',
                theme_color: '#181C56',
                description: 'Lag din egen sanntidstavle.',
                orientation: 'portrait',
                lang: 'no',
                icons: [
                    {
                        src: `${origin}/images/logo/logo-72x72.png`,
                        sizes: '72x72',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: `${origin}/images/logo/logo-96x96.png`,
                        sizes: '96x96',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: `${origin}/images/logo/logo-128x128.png`,
                        sizes: '128x128',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: `${origin}/images/logo/logo-144x144.png`,
                        sizes: '144x144',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: `${origin}/images/logo/logo-152x152.png`,
                        sizes: '152x152',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: `${origin}/images/logo/logo-192x192.png`,
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: `${origin}/images/logo/logo-384x384.png`,
                        sizes: '384x384',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: `${origin}/images/logo/logo-512x512.png`,
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
                splash_screen: [
                    {
                        src: `${origin}/images/splash/startup-image-1284x2778.png`,
                        sizes: '1284x2778',
                        type: 'image/png',
                    },
                ],
            }
            const stringManifest = JSON.stringify(dynamicManifest)
            const blob = new Blob([stringManifest], {
                type: 'application/json',
            })
            const manifestURL = URL.createObjectURL(blob)
            manifest.setAttribute('href', manifestURL)
        }
    }, [location.pathname])
}

export { useUpdateManifest }
