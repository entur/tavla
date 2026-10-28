import { Paragraph } from '@entur/typography'
import type { EventProps } from 'app/posthog/events'
import { useMemo } from 'react'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import type { TTransportMode } from 'src/types/graphql-schema'
import type { LineWithFrontText, QuayWithFrontText } from '../../utils/types'
import { TileContext } from '../context'
import {
    applyKeyToggle,
    generateQuayLineKey,
    transportModeNames,
} from '../utils'
import { TransportModeLines } from './TransportModeLines'

type ModeGroup = {
    mode: TTransportMode
    label: string
    lines: LineWithFrontText[]
    keysByLineId: Map<string, string[]>
}

function buildModeGroups(quays: QuayWithFrontText[]): ModeGroup[] {
    const byMode = new Map<
        TTransportMode,
        Map<string, { line: LineWithFrontText; keys: string[] }>
    >()

    for (const quay of quays) {
        for (const line of quay.lines) {
            if (line.frontTexts && line.frontTexts.length === 0) continue

            const mode =
                (line.transportMode as TTransportMode | null) ?? 'unknown'
            const key = generateQuayLineKey(quay.id, line.id)

            if (!byMode.has(mode)) byMode.set(mode, new Map())
            const lineMap = byMode.get(mode)
            if (!lineMap) continue

            const existing = lineMap.get(line.id)
            if (existing) {
                existing.keys.push(key)
                existing.line = {
                    ...existing.line,
                    frontTexts: Array.from(
                        new Set([
                            ...existing.line.frontTexts,
                            ...line.frontTexts,
                        ]),
                    ),
                }
            } else {
                lineMap.set(line.id, { line, keys: [key] })
            }
        }
    }

    return Array.from(byMode.entries())
        .map(([mode, lineMap]) => ({
            mode,
            label: transportModeNames(mode) || 'Ukjent',
            lines: Array.from(lineMap.values()).map((v) => v.line),
            keysByLineId: new Map(
                Array.from(lineMap.entries()).map(([id, v]) => [id, v.keys]),
            ),
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'nb-NO'))
}

export function StopPlaceFilterView({
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
    const modeGroups = useMemo(() => buildModeGroups(quays), [quays])

    const handleToggle = (keys: string[], checked: boolean) => {
        onCheckedLineIdsChange(applyKeyToggle(checkedLineIds, keys, checked))
        onFieldChanged('lines')
    }

    return (
        <div className="flex flex-col gap-2">
            <Paragraph margin="none">
                Velg hvilke transportmidler du vil se
            </Paragraph>
            {modeGroups.map((group) => (
                <TransportModeLines
                    key={group.mode}
                    tile={tile}
                    groupKey={group.mode}
                    title={group.label}
                    lines={group.lines}
                    trackingLocation={trackingLocation}
                    selectedLineIds={checkedLineIds}
                    getLineKeys={(line) =>
                        group.keysByLineId.get(line.id) ?? []
                    }
                    onToggleLine={handleToggle}
                    onToggleGroup={handleToggle}
                />
            ))}
        </div>
    )
}
