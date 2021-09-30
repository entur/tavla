import { useEffect, useState } from 'react'

import { getStopPlacesWithLines } from '../service'
import { Line, StopPlaceWithLines } from '../types'
import { unique } from '../utils'

import { useSettingsContext } from '../settings'

import { useStopPlacesWithDepartures } from '.'

interface IReturn {
    uniqueLines: Line[] | undefined
    stopPlacesWithLines: StopPlaceWithLines[] | undefined
}

export const useStopPlacesWithLines = (): IReturn => {
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
        const abortController = new AbortController()
        const fetchDataAndSetStates = async () => {
            if (stopPlaces) {
                try {
                    const result: StopPlaceWithLines[] =
                        await getStopPlacesWithLines(
                            stopPlaces.map((sPlace) => sPlace.id),
                            abortController.signal,
                        )
                    setStopPlacesWithLines(result)

                    const lines: Line[] = unique(
                        result
                            .map((el) => {
                                el.lines = el.lines.filter((line) =>
                                    hiddenStopModes && hiddenStopModes[el.id]
                                        ? !hiddenStopModes[el.id].includes(
                                              line.transportMode,
                                          )
                                        : line,
                                )
                                return el
                            })
                            .flatMap((el) => el.lines),
                        (a: Line, b: Line) => a.id === b.id,
                    )
                    setUniqueLines(lines)
                } catch (error) {
                    if (!(error instanceof DOMException)) throw error
                }
            }
        }
        fetchDataAndSetStates()
        return () => {
            abortController.abort()
        }
    }, [stopPlaces, hiddenStopModes])

    return { uniqueLines, stopPlacesWithLines }
}
