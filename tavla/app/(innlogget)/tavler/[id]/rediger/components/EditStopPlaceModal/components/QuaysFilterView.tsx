import { Paragraph } from '@entur/typography'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import {
    getTransportModesFromLines,
    sortByTransportMode,
} from 'app/_components/TransportIcon/utils'
import type { EventProps } from 'app/posthog/events'
import type { TTransportMode } from 'src/types/graphql-schema'
import type { QuaysFilterDB } from 'types/db-types/boards'
import type { QuayWithFrontText } from '../../utils/types'
import { LineGroupFilter } from './LineGroupFilter'

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
        const existingSelectedLines =
            quaysFilter.quays.find((q) => q.id === quayId)?.selectedLines ?? []
        const newSelectedLines = checked
            ? [...existingSelectedLines, lineId]
            : existingSelectedLines.filter((id) => id !== lineId)

        setQuaysFilter({
            ...quaysFilter,
            quays: quaysFilter.quays.map((existingQuayFilter) =>
                existingQuayFilter.id === quayId
                    ? {
                          ...existingQuayFilter,
                          selectedLines: newSelectedLines,
                      }
                    : existingQuayFilter,
            ),
        })

        onFieldChanged('quays_filter')
    }

    const handleGroupToggle = (quayId: string, checked: boolean) => {
        const quay = quays.find((q) => q.id === quayId)
        if (!quay) return

        const newSelectedLines = checked ? quay.lines.map((l) => l.id) : []

        setQuaysFilter({
            ...quaysFilter,
            quays: quaysFilter.quays.map((existingQuayFilter) =>
                existingQuayFilter.id === quayId
                    ? {
                          ...existingQuayFilter,
                          selectedLines: newSelectedLines,
                      }
                    : existingQuayFilter,
            ),
        })

        onFieldChanged('quays_filter')
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
                <LineGroupFilter
                    key={quay.id}
                    groupId={quay.id}
                    title={getQuayTitle(quay)}
                    description={quay.description ?? undefined}
                    tooltip={
                        quay.publicCode
                            ? undefined
                            : `Plattformkode: ${quay.id}`
                    }
                    icons={getTransportModesFromLines(quay.lines)
                        .sort(sortByTransportMode)
                        .map((transportMode) => (
                            <TransportIcon
                                key={`${transportMode.transportMode}|${transportMode.transportSubmode ?? ''}`}
                                transportMode={transportMode.transportMode}
                                transportSubmode={
                                    transportMode.transportSubmode
                                }
                                background
                                whiteIcon
                                includeTooltip
                            />
                        ))}
                    availableLines={quay.lines}
                    selectedLines={
                        quaysFilter.quays.find((q) => q.id === quay.id)
                            ?.selectedLines ?? []
                    }
                    trackingLocation={trackingLocation}
                    trackingField="quays_filter"
                    onToggleLine={handleToggleLine}
                    onToggleGroup={handleGroupToggle}
                />
            ))}
        </div>
    )
}
