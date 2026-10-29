import type { EventProps } from 'app/posthog/events'
import { Paragraph } from 'node_modules/@entur/typography'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import type { TTransportMode } from 'src/types/graphql-schema'
import type { QuaysFilterDB } from 'types/db-types/boards'
import type { QuayWithFrontText } from '../../utils/types'
import { TileContext } from '../context'
import { PlatformAndLines } from './PlatformAndLines'

function getPrimaryTransportMode(
    quay: QuayWithFrontText,
): TTransportMode | undefined {
    const counts = new Map<TTransportMode, number>()
    for (const line of quay.lines) {
        const mode = line.transportMode as TTransportMode | null | undefined
        if (!mode || mode === 'unknown') continue
        counts.set(mode, (counts.get(mode) ?? 0) + 1)
    }

    return Array.from(counts.entries()).sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1]
        return a[0].localeCompare(b[0])
    })[0]?.[0]
}

function getQuayTitle(quay: QuayWithFrontText): string {
    if (!quay.name || !quay.publicCode) return quay.name || 'Ukjent'

    const primaryMode = getPrimaryTransportMode(quay)
    const prefix =
        primaryMode === 'metro' || primaryMode === 'rail' ? 'Spor' : 'Plattform'

    return `${prefix} ${quay.publicCode}`
}

export function QuaysFilterView({
    quays,
    quaysFilter,
    setQuaysFilter,
    trackingLocation,
    onFieldChanged,
}: {
    quays: QuayWithFrontText[]
    quaysFilter: QuaysFilterDB
    setQuaysFilter: (quaysFilter: QuaysFilterDB) => void
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    onFieldChanged: (field: string) => void
}) {
    const handleToggleLine = (
        quayId: string,
        lineId: string,
        checked: boolean,
    ) => {
        const existingQuay = quaysFilter.quays.find((q) => q.id === quayId)

        if (checked) {
            if (existingQuay) {
                setQuaysFilter({
                    ...quaysFilter,
                    quays: quaysFilter.quays.map((q) =>
                        q.id === quayId
                            ? {
                                  ...q,
                                  whitelistedLines: [
                                      ...q.whitelistedLines.filter(
                                          (id) => id !== lineId,
                                      ),
                                      lineId,
                                  ],
                              }
                            : q,
                    ),
                })
            } else {
                setQuaysFilter({
                    ...quaysFilter,
                    quays: [
                        ...quaysFilter.quays,
                        { id: quayId, whitelistedLines: [lineId] },
                    ],
                })
            }
        } else {
            setQuaysFilter({
                ...quaysFilter,
                quays: quaysFilter.quays
                    .map((q) =>
                        q.id === quayId
                            ? {
                                  ...q,
                                  whitelistedLines: q.whitelistedLines.filter(
                                      (id) => id !== lineId,
                                  ),
                              }
                            : q,
                    )
                    .filter(
                        (q) => q.id !== quayId || q.whitelistedLines.length > 0,
                    ),
            })
        }

        onFieldChanged('lines')
    }

    const handleGroupToggle = (quayId: string, checked: boolean) => {
        if (checked) {
            setQuaysFilter({
                ...quaysFilter,
                quays: [
                    ...quaysFilter.quays.filter((q) => q.id !== quayId),
                    { id: quayId, whitelistedLines: [] },
                ],
            })
        } else {
            setQuaysFilter({
                ...quaysFilter,
                quays: quaysFilter.quays.filter((q) => q.id !== quayId),
            })
        }

        onFieldChanged('lines')
    }

    const sortedQuays = [...quays].sort((a, b) =>
        (a.publicCode || '').localeCompare(b.publicCode || '', 'nb-NO', {
            numeric: true,
        }),
    )

    return (
        <div className="flex flex-col gap-2">
            <Paragraph margin="none">
                Velg hvilke plattformer du vil se
            </Paragraph>
            {sortedQuays.map((quay) => (
                <PlatformAndLines
                    key={quay.id}
                    quayId={quay.id}
                    title={getQuayTitle(quay)}
                    description={quay.description ?? undefined}
                    tooltip={
                        quay.publicCode
                            ? undefined
                            : `Plattformkode: ${quay.id}`
                    }
                    lines={quay.lines}
                    trackingLocation={trackingLocation}
                    selectedLineIds={
                        quaysFilter.quays.find((q) => q.id === quay.id)
                            ?.whitelistedLines ?? []
                    }
                    isGroupSelected={quaysFilter.quays.some(
                        (q) => q.id === quay.id,
                    )}
                    onToggleLine={handleToggleLine}
                    onToggleGroup={handleGroupToggle}
                />
            ))}
        </div>
    )
}
