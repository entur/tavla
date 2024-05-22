import { useState, useEffect } from 'react'

function useBreakpoint(mediaQuery: string): boolean {
    const [match, setMatch] = useState(false)

    useEffect(() => {
        let media: MediaQueryList

        const handleQueryListener = (event: MediaQueryListEvent) => {
            setMatch(event.matches)
        }

        if (window && window.matchMedia) {
            media = window.matchMedia(mediaQuery)

            setMatch(media.matches)

            if (media.addEventListener) {
                media.addEventListener('change', handleQueryListener)
            }
        }

        return () => {
            if (media && media.removeEventListener) {
                media.removeEventListener('change', handleQueryListener)
            }
        }
    }, [mediaQuery])

    return match
}

export { useBreakpoint }
