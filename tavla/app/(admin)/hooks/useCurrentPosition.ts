import { useCallback, useState } from 'react'
import { getCurrentPosition } from '../utils/position'

function useCurrentPosition(options?: PositionOptions) {
    const [position, setPosition] = useState<GeolocationPosition | null>(null)
    const [error, setError] = useState<GeolocationPositionError | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchPosition = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const pos = await getCurrentPosition(options)
            setPosition(pos)
            return pos
        } catch (e) {
            setError(e as GeolocationPositionError)
            return null
        } finally {
            setLoading(false)
        }
    }, [options])

    return { position, error, loading, fetchPosition }
}

export default useCurrentPosition
