import { useEffect, useState } from 'react'

import { getStopPlacesWithLines } from '../service'
import { Line, StopPlaceWithLines } from '../types'
import { unique } from '../utils'

import { useStopPlacesWithDepartures } from '.'

export const useStopPlacesWithLines = () => {
    const [uniqueLines, setUniqueLines] = useState<Line[] | undefined>(
        undefined,
    )
    const stopPlaces = useStopPlacesWithDepartures()
    const [stopPlacesWithLines, setStopPlacesWithLines] = useState<
        StopPlaceWithLines[]
    >([])

    useEffect(() => {
        const abortController = new AbortController()
        const test = async () => {
            if (stopPlaces) {
                const result: StopPlaceWithLines[] =
                    await getStopPlacesWithLines(
                        stopPlaces.map((sPlace) => sPlace.id),
                        abortController.signal,
                    )

                setStopPlacesWithLines(result)

                const lines: Line[] = unique(
                    result.flatMap((el) => el.lines),
                    (a: Line, b: Line) => a.id === b.id,
                )
                setUniqueLines(lines)
            }
        }
        if (stopPlaces) test()
        return () => {
            abortController.abort()
        }
    }, [stopPlaces])

    return { uniqueLines, stopPlacesWithLines }
}
