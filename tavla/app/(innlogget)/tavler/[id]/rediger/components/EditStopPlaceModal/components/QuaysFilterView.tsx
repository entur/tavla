import { Paragraph } from '@entur/typography'
import type { EventProps } from 'app/posthog/events'
import type { TTransportMode } from 'src/types/graphql-schema'
import type { QuaysFilterDB } from 'types/db-types/boards'
import type { QuayWithFrontText } from '../../utils/types'
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
        const existingWhitelistedLines =
            quaysFilter.quays.find((q) => q.id === quayId)?.whitelistedLines ??
            []
        const newWhitelistedLines = checked
            ? [...existingWhitelistedLines, lineId]
            : existingWhitelistedLines.filter((id) => id !== lineId)

        setQuaysFilter({
            ...quaysFilter,
            quays: quaysFilter.quays.map((existingQuayFilter) =>
                existingQuayFilter.id === quayId
                    ? {
                          ...existingQuayFilter,
                          whitelistedLines: newWhitelistedLines,
                      }
                    : existingQuayFilter,
            ),
        })

        onFieldChanged('lines')
    }

    const handleGroupToggle = (quayId: string, checked: boolean) => {
        const quay = quays.find((q) => q.id === quayId)
        if (!quay) return

        const newWhitelistedLines = checked ? quay.lines.map((l) => l.id) : []

        setQuaysFilter({
            ...quaysFilter,
            quays: quaysFilter.quays.map((existingQuayFilter) =>
                existingQuayFilter.id === quayId
                    ? {
                          ...existingQuayFilter,
                          whitelistedLines: newWhitelistedLines,
                      }
                    : existingQuayFilter,
            ),
        })

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
                    availableLines={quay.lines}
                    whitelistedLines={
                        quaysFilter.quays.find((q) => q.id === quay.id)
                            ?.whitelistedLines ?? []
                    }
                    trackingLocation={trackingLocation}
                    onToggleLine={handleToggleLine}
                    onToggleGroup={handleGroupToggle}
                />
            ))}
        </div>
    )
}
