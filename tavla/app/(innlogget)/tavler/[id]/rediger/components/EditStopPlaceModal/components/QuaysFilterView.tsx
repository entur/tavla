import type { EventProps } from 'app/posthog/events'
import { Paragraph } from 'node_modules/@entur/typography'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import type { TTransportMode } from 'src/types/graphql-schema'
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
    checkedLineIds,
    onCheckedLineIdsChange,
    trackingLocation,
    onFieldChanged,
}: {
    quays: QuayWithFrontText[]
    checkedLineIds: Set<string>
    onCheckedLineIdsChange: (checkedLineIds: Set<string>) => void
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    onFieldChanged: (field: string) => void
}) {
    const tile = useNonNullContext(TileContext)

    const handleToggleLine = (key: string) => {
        const newSet = new Set(checkedLineIds)
        if (newSet.has(key)) {
            newSet.delete(key)
        } else {
            newSet.add(key)
        }
        onCheckedLineIdsChange(newSet)
        onFieldChanged('lines')
    }

    const handleGroupToggle = (keys: string[], checked: boolean) => {
        const newSet = new Set(checkedLineIds)
        if (checked) {
            for (const key of keys) newSet.add(key)
        } else {
            for (const key of keys) newSet.delete(key)
        }
        onCheckedLineIdsChange(newSet)
        onFieldChanged('lines')
    }

    const sortedQuays = [...quays].sort((a, b) =>
        (a.publicCode || '').localeCompare(b.publicCode || '', 'nb-NO', {
            numeric: true,
        }),
    )

    return (
        <div className="flex flex-col gap-2">
            <Paragraph>Velg hvilke plattformer du vil se.</Paragraph>
            {sortedQuays.map((quay) => (
                <PlatformAndLines
                    key={quay.id}
                    tile={tile}
                    quayId={quay.id}
                    groupKey={quay.publicCode || quay.id}
                    title={getQuayTitle(quay)}
                    description={quay.description}
                    quayCodeTooltip={
                        quay.publicCode ? null : `Plattformkode: ${quay.id}`
                    }
                    lines={quay.lines}
                    trackingLocation={trackingLocation}
                    fallbackTransportModes={[]}
                    selectedLineIds={checkedLineIds}
                    onToggleLine={handleToggleLine}
                    onToggleGroup={handleGroupToggle}
                />
            ))}
        </div>
    )
}
