import { Paragraph } from '@entur/typography'
import type { EventProps } from 'app/posthog/events'
import { useMemo } from 'react'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import type { StopPlaceFilterDB } from 'src/types/db-types/boards'
import type { TTransportMode } from 'src/types/graphql-schema'
import type { LineWithFrontText, QuayWithFrontText } from '../../utils/types'
import { TileContext } from '../context'
import { transportModeNames } from '../utils'
import { TransportModeAndLines } from './TransportModeAndLines'

type ModeGroup = {
    mode: TTransportMode
    label: string
    lines: LineWithFrontText[]
}

function buildModeGroups(quays: QuayWithFrontText[]): ModeGroup[] {
    const byMode = new Map<TTransportMode, Map<string, LineWithFrontText>>()

    for (const quay of quays) {
        for (const line of quay.lines) {
            if (line.frontTexts && line.frontTexts.length === 0) continue

            const mode =
                (line.transportMode as TTransportMode | null) ?? 'unknown'
            if (!byMode.has(mode)) byMode.set(mode, new Map())
            const lineMap = byMode.get(mode)
            if (!lineMap) continue

            const existing = lineMap.get(line.id)
            lineMap.set(line.id, {
                ...line,
                frontTexts: existing
                    ? Array.from(
                          new Set([...existing.frontTexts, ...line.frontTexts]),
                      )
                    : line.frontTexts,
            })
        }
    }

    return Array.from(byMode.entries())
        .map(([mode, lineMap]) => ({
            mode,
            label: transportModeNames(mode) || 'Ukjent',
            lines: Array.from(lineMap.values()),
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'nb-NO'))
}

function emptyFilter(): StopPlaceFilterDB {
    return {
        type: 'stopPlaceFilter',
        whitelistedModes: [],
        whitelistedLines: [],
    }
}

/** Tom whitelist (ingen moduser, ingen linjer) betyr "ingen begrensning" = alt vises. */
function deriveSelectedLineIds(
    filter: StopPlaceFilterDB,
    modeGroups: ModeGroup[],
): Set<string> {
    const isUnrestricted =
        filter.whitelistedModes.length === 0 &&
        filter.whitelistedLines.length === 0

    if (isUnrestricted) {
        return new Set(modeGroups.flatMap((g) => g.lines.map((l) => l.id)))
    }

    const selected = new Set(filter.whitelistedLines)
    for (const group of modeGroups) {
        if (filter.whitelistedModes.includes(group.mode)) {
            for (const line of group.lines) selected.add(line.id)
        }
    }
    return selected
}

/** Kollapser tilbake til den tomme whitelisten hvis alt er valgt, i stedet for å lagre en lang redundant liste. */
function buildFilterFromSelection(
    selectedLineIds: Set<string>,
    modeGroups: ModeGroup[],
): StopPlaceFilterDB {
    const allLineIds = modeGroups.flatMap((g) => g.lines.map((l) => l.id))
    const allSelected = allLineIds.every((id) => selectedLineIds.has(id))

    if (allSelected) return emptyFilter()

    const whitelistedModes: TTransportMode[] = []
    const whitelistedLines: string[] = []

    for (const group of modeGroups) {
        const groupFullySelected = group.lines.every((line) =>
            selectedLineIds.has(line.id),
        )
        if (groupFullySelected) {
            whitelistedModes.push(group.mode)
            continue
        }
        for (const line of group.lines) {
            if (selectedLineIds.has(line.id)) whitelistedLines.push(line.id)
        }
    }

    return { type: 'stopPlaceFilter', whitelistedModes, whitelistedLines }
}

export function StopPlaceFilterView({
    quays,
    filter,
    onFilterChange,
    trackingLocation,
    onFieldChanged,
}: {
    quays: QuayWithFrontText[]
    filter: StopPlaceFilterDB | undefined
    onFilterChange: (filter: StopPlaceFilterDB) => void
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    onFieldChanged: (field: string) => void
}) {
    const tile = useNonNullContext(TileContext)
    const modeGroups = useMemo(() => buildModeGroups(quays), [quays])

    return (
        <div className="flex flex-col gap-2">
            <Paragraph margin="none">
                Velg hvilke transportmidler du vil se
            </Paragraph>
            {modeGroups.map((group) => (
                <TransportModeAndLines
                    key={group.mode}
                    tile={tile}
                    groupKey={group.mode}
                    title={group.label}
                    lines={group.lines}
                    selectedLineIds={new Set(filter?.whitelistedLines ?? [])}
                    trackingLocation={trackingLocation}
                    onToggleLine={(lineId, checked) =>
                        console.log(lineId, checked)
                    }
                    onToggleGroup={(linesIds, checked) =>
                        console.log(linesIds, checked)
                    }
                />
            ))}
        </div>
    )
}
