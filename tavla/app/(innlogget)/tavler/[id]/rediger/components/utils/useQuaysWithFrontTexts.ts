import { useEffect, useState } from 'react'
import { CLIENT_NAME, GRAPHQL_ENDPOINTS } from 'src/assets/env'
import { QuayEstimatedCallsQuery } from 'src/graphql'
import type { TQuay } from 'src/types/graphql-schema'
import type { LineWithFrontText, QuayWithFrontText } from './types'

async function getFrontTextsForQuay(
    quayId: string,
    isArrival: boolean,
): Promise<Map<string, string[]>> {
    const linesToFrontTexts = new Map<string, string[]>()

    try {
        const res = await fetch(GRAPHQL_ENDPOINTS['journey-planner'], {
            headers: {
                'Content-Type': 'application/json',
                'ET-Client-Name': CLIENT_NAME,
            },
            body: JSON.stringify({
                query: QuayEstimatedCallsQuery,
                variables: {
                    quayId: quayId,
                    arrivalDeparture: isArrival ? 'arrivals' : 'departures',
                },
            }),
            method: 'POST',
        })

        const json = await res.json()
        const estimatedCalls = json.data?.quay?.estimatedCalls ?? []

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
    quay: TQuay,
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
    quays: TQuay[] | null,
    isArrival: boolean,
    enabled: boolean,
): QuayWithFrontText[] | null {
    const [quaysWithFrontTexts, setQuaysWithFrontTexts] = useState<
        QuayWithFrontText[] | null
    >(null)

    useEffect(() => {
        if (!enabled || !quays) return

        async function fetchData() {
            if (!quays) return
            const result = await Promise.all(
                quays.map(async (quay) => {
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
    }, [quays, isArrival, enabled])

    return quaysWithFrontTexts
}

export { useQuaysWithFrontTexts }
