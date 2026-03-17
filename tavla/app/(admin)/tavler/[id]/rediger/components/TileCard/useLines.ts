import { useEffect, useState } from 'react'
import { CLIENT_NAME, GRAPHQL_ENDPOINTS } from 'src/assets/env'
import { QuayEstimatedCallsQuery, StopPlaceEditQuery } from 'src/graphql'
import { BoardTileDB } from 'src/types/db-types/boards'
import { TQuay } from 'src/types/graphql-schema'
import { TLineFragment, TQuayFrontText } from './types'

async function getFrontTextsForQuay(
    quayId: string,
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
                variables: { quayId: quayId },
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
): TLineFragment[] {
    return quay.lines
        .map((line) => {
            const lineFrontTexts = frontTexts.get(line.id)
            if (!lineFrontTexts || lineFrontTexts.length === 0) return null
            return { ...line, frontTexts: lineFrontTexts } as TLineFragment
        })
        .filter((line): line is TLineFragment => line !== null)
}

function useLines(tile: BoardTileDB): TQuayFrontText[] | null {
    const [quays, setQuays] = useState<TQuayFrontText[] | null>(null)

    useEffect(() => {
        let cancelled = false

        async function fetchData() {
            await fetch(GRAPHQL_ENDPOINTS['journey-planner'], {
                headers: {
                    'Content-Type': 'application/json',
                    'ET-Client-Name': CLIENT_NAME,
                },
                body: JSON.stringify({
                    query: StopPlaceEditQuery,
                    variables: { placeId: tile.stopPlaceId },
                }),
                method: 'POST',
            }).then(async (res) => {
                const json = await res.json()
                const quays: TQuay[] = json.data?.stopPlace?.quays ?? []

                if (cancelled) return

                setQuays(
                    quays.map((q) => ({
                        ...q,
                        lines: q.lines.map((l) => ({
                            ...l,
                            frontTexts: undefined,
                        })),
                    })),
                )

                for (const quay of quays) {
                    const frontTexts = await getFrontTextsForQuay(quay.id)
                    const quayWithFrontTexts = addFrontTextToQuay(
                        quay,
                        frontTexts,
                    )

                    setQuays((prev) =>
                        (prev ?? []).map((q) =>
                            q.id === quay.id
                                ? {
                                      ...q,
                                      lines: quayWithFrontTexts,
                                  }
                                : q,
                        ),
                    )
                }
            })
        }

        fetchData().catch(() => setQuays([]))

        return () => {
            cancelled = true
        }
    }, [])

    return quays
}

export { useLines }
