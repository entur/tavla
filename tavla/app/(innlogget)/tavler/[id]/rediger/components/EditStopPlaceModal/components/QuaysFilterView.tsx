import { Paragraph } from '@entur/typography'
import type { EventProps } from 'app/posthog/events'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import type { TTransportMode } from 'src/types/graphql-schema'
import type { QuayWithFrontText } from '../../utils/types'
import { TileContext } from '../context'
import { applyKeyToggle, generateQuayLineKey } from '../utils'
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

    const handleToggle = (keys: string[], checked: boolean) => {
        onCheckedLineIdsChange(applyKeyToggle(checkedLineIds, keys, checked))
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
                    tile={tile}
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
                    getLineKeys={(line) => [
                        generateQuayLineKey(quay.id, line.id),
                    ]}
                    onToggleLine={handleToggle}
                    onToggleGroup={handleToggle}
                />
            ))}
        </div>
    )
}
