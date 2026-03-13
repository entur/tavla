import { useCallback, useState } from 'react'
import { getCurrentPosition } from '../utils/position'

type CurrentPositionState =
    | { type: 'loading' }
    | { type: 'error'; error: GeolocationPositionError }
    | { type: 'success'; position: GeolocationPosition }

function useCurrentPosition(options?: PositionOptions): {
    currentPositionState: CurrentPositionState | null
    fetchPosition: () => Promise<GeolocationPosition | null>
} {
    const [currentPositionState, setCurrentPositionState] =
        useState<CurrentPositionState | null>(null)

    const fetchPosition = useCallback(async () => {
        setCurrentPositionState({ type: 'loading' })
        try {
            const pos = await getCurrentPosition(options)
            setCurrentPositionState({ type: 'success', position: pos })
            return pos
        } catch (e) {
            setCurrentPositionState({
                type: 'error',
                error: e as GeolocationPositionError,
            })
            return null
        }
    }, [options])

    return { currentPositionState, fetchPosition }
}

export default useCurrentPosition
