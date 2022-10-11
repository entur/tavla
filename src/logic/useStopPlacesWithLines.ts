import { useEffect, useState } from 'react'
import { Line, StopPlaceWithLines } from '../types'
import { createAbortController, unique } from '../utils'
import { useSettingsContext } from '../settings'
import { getStopPlacesWithLines } from './getStopPlacesWithLines'
import { useStopPlacesWithDepartures } from './useStopPlacesWithDepartures'

interface Return {
    uniqueLines: Line[] | undefined
    stopPlacesWithLines: StopPlaceWithLines[] | undefined
}

export const useStopPlacesWithLines = (): Return => {
    const [settings] = useSettingsContext()
    const { hiddenStopModes } = settings || {}
    const [uniqueLines, setUniqueLines] = useState<Line[] | undefined>(
        undefined,
    )
    const stopPlaces = useStopPlacesWithDepartures()
    const [stopPlacesWithLines, setStopPlacesWithLines] = useState<
        StopPlaceWithLines[]
    >([])

    useEffect(() => {
        const abortController = createAbortController()
        const fetchDataAndSetStates = async () => {
            if (!stopPlaces) return
            try {
                const result: StopPlaceWithLines[] =
                    await getStopPlacesWithLines(
                        stopPlaces.map((sPlace) => sPlace.id),
                    )
                setStopPlacesWithLines(result)

                const lines: Line[] = unique(
                    result
                        .map((el) => ({
                            ...el,
                            lines: el.lines.filter((line) =>
                                hiddenStopModes && hiddenStopModes[el.id]
                                    ? !hiddenStopModes[el.id]?.includes(
                                          line.transportMode,
                                      )
                                    : line,
                            ),
                        }))
                        .flatMap((el) => el.lines),
                    (a: Line, b: Line) => a.id === b.id,
                )
                setUniqueLines(lines)
            } catch (error) {
                if (
                    !(error instanceof DOMException) ||
                    error.name !== 'AbortError'
                )
                    throw error
            }
        }
        fetchDataAndSetStates()
        return () => {
            abortController.abort()
        }
    }, [stopPlaces, hiddenStopModes])

    return { uniqueLines, stopPlacesWithLines }
}
