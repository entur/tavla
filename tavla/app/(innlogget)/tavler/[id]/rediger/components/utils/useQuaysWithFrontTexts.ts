import { useEffect, useState } from 'react'
import { QuayEstimatedCallsQuery } from 'src/graphql'
import { fetchQuery } from 'src/graphql/utils'
import type { TQuayFragment } from 'types/operations'
import type { LineWithFrontText, QuayWithFrontText } from './types'

async function getFrontTextsForQuay(
    quayId: string,
    isArrival: boolean,
): Promise<Map<string, string[]>> {
    const linesToFrontTexts = new Map<string, string[]>()

    try {
        const response = await fetchQuery(QuayEstimatedCallsQuery, {
            quayId,
            arrivalDeparture: isArrival ? 'arrivals' : 'departures',
        })
        const estimatedCalls = response.quay?.estimatedCalls ?? []

        for (const departure of estimatedCalls) {
            const lineId = departure.serviceJourney?.line?.id
            const frontText = departure.destinationDisplay?.frontText

            if (!lineId || !frontText) continue

            const line = linesToFrontTexts.get(lineId) ?? []

            if (!line.includes(frontText)) {
                line.push(frontText)
                linesToFrontTexts.set(lineId, line)
            }
        }
    } catch {
        // return nothing
    }

    return linesToFrontTexts
}

function addFrontTextToQuay(
    quay: TQuayFragment,
    frontTexts: Map<string, string[]>,
): LineWithFrontText[] {
    return quay.lines
        .map((line) => {
            const lineFrontTexts = frontTexts.get(line.id)
            if (!lineFrontTexts || lineFrontTexts.length === 0) return null
            return { ...line, frontTexts: lineFrontTexts }
        })
        .filter((line) => line !== null)
}

function useQuaysWithFrontTexts(
    quays: TQuayFragment[] | null,
    isArrival: boolean,
): QuayWithFrontText[] | null {
    const [quaysWithFrontTexts, setQuaysWithFrontTexts] = useState<
        QuayWithFrontText[] | null
    >(null)

    useEffect(() => {
        if (!quays) return
        const currentQuays = quays

        async function fetchData() {
            const result = await Promise.all(
                currentQuays.map(async (quay) => {
                    const frontTexts = await getFrontTextsForQuay(
                        quay.id,
                        isArrival,
                    )

                    const lines = addFrontTextToQuay(quay, frontTexts)

                    return {
                        ...quay,
                        lines,
                    }
                }),
            )

            setQuaysWithFrontTexts(result)
        }

        fetchData().catch(() => setQuaysWithFrontTexts([]))
    }, [quays, isArrival])

    return quaysWithFrontTexts
}

export { useQuaysWithFrontTexts }
