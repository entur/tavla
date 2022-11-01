import { useEffect, useState } from 'react'
import { Line, StopPlaceWithLines } from '../types'
import { createAbortController } from '../utils/utils'
import { useSettings } from '../settings/SettingsProvider'
import { unique } from '../utils/array'
import { getStopPlacesWithLines } from './get-stop-places-with-lines/getStopPlacesWithLines'
import { useStopPlacesWithDepartures } from './use-stop-places-with-departures/useStopPlacesWithDepartures'

export const useStopPlacesWithLines = (): Line[] => {
    const [settings] = useSettings()
    const { hiddenStopModes } = settings || {}
    const [uniqueLines, setUniqueLines] = useState<Line[]>([])
    const stopPlaces = useStopPlacesWithDepartures()

    useEffect(() => {
        const abortController = createAbortController()
        const fetchDataAndSetStates = async () => {
            if (!stopPlaces) return
            try {
                const result: StopPlaceWithLines[] =
                    await getStopPlacesWithLines(
                        stopPlaces.map((sPlace) => sPlace.id),
                    )

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

    return uniqueLines
}
