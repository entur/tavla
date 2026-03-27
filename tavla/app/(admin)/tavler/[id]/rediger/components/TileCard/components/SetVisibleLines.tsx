import { Heading4 } from '@entur/typography'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { TransportModeChip } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/components/TransportModeChip'
import { TileContext } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/context'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import type { BoardTileDB } from 'src/types/db-types/boards'
import type { TTransportMode } from 'src/types/graphql-schema'
import { PlatformAndLines } from '../PlatformAndLines'
import type { LineWithFrontText, QuayWithFrontText } from '../types'
import { transportModeNames } from '../utils'

function getInitialCheckedLineIds(
    tile: BoardTileDB,
    quays: QuayWithFrontText[],
): Set<string> {
    const set = new Set<string>()
    const hasQuayFilter = tile.quays && tile.quays.length > 0

    for (const quay of quays) {
        const savedQuay = tile.quays?.find((q) => q.id === quay.id)
        if (savedQuay) {
            if (savedQuay.whitelistedLines.length === 0) {
                for (const l of quay.lines) set.add(`${quay.id}||${l.id}`)
            } else {
                for (const lineId of savedQuay.whitelistedLines)
                    set.add(`${quay.id}||${lineId}`)
            }
        } else if (hasQuayFilter) {
            // Per-quay filter exists but this quay has no entry: nothing selected
        } else if (tile.whitelistedLines && tile.whitelistedLines.length > 0) {
            for (const l of quay.lines) {
                if (tile.whitelistedLines?.includes(l.id)) {
                    set.add(`${quay.id}||${l.id}`)
                }
            }
        } else {
            for (const l of quay.lines) set.add(`${quay.id}||${l.id}`)
        }
    }

    return set
}

type QuaysByTransportMode = {
    mode: TTransportMode
    label: string
    quays: QuayWithFrontText[]
}

type ColumnItem =
    | { type: 'mode_group'; data: QuaysByTransportMode }
    | { type: 'quay'; mode: TTransportMode; data: QuayWithFrontText }

function generateQuayModesMap(
    quays: QuayWithFrontText[],
): Map<string, TTransportMode[]> {
    const map = new Map<string, TTransportMode[]>()

    quays.forEach((quay) => {
        const modeCounts = new Map<TTransportMode, number>()
        quay.lines.forEach((l) => {
            const m = l.transportMode as TTransportMode
            if (m && m !== 'unknown') {
                modeCounts.set(m, (modeCounts.get(m) || 0) + 1)
            }
        })

        const modes = Array.from(modeCounts.entries())
            .sort((a, b) => {
                if (b[1] !== a[1]) return b[1] - a[1]
                return a[0].localeCompare(b[0])
            })
            .map(([mode]) => mode)

        if (
            modes.length === 0 &&
            quay.stopPlace?.transportMode &&
            quay.stopPlace.transportMode.length > 0
        ) {
            modes.push(
                ...(quay.stopPlace.transportMode
                    .map((m) => m as TTransportMode)
                    .filter((m) => !!m && m !== 'unknown') || []),
            )
        }

        const uniqueModes = Array.from(new Set(modes))
        map.set(quay.id, uniqueModes)
    })

    return map
}

function sortAndDistributeColumnItems(quays: QuayWithFrontText[]): {
    modes: TTransportMode[]
    quayModesMap: Map<string, TTransportMode[]>
    columns: ColumnItem[][]
} {
    const columns: ColumnItem[][] = [[], []]
    const columnHeights = [0, 0]
    const itemsToDistribute: ColumnItem[] = []
    const quayModesMap = generateQuayModesMap(quays)

    const quaysByTransportMode = Object.values(
        quays.reduce(
            (prev, quay) => {
                const modes = quayModesMap.get(quay.id) || []

                const primaryMode: TTransportMode =
                    modes.length > 0 ? (modes[0] as TTransportMode) : 'unknown'

                if (!prev[primaryMode]) {
                    prev[primaryMode] = {
                        mode: primaryMode,
                        label: transportModeNames(primaryMode) || 'Ukjent',
                        quays: [],
                    }
                }

                prev[primaryMode]?.quays.push(quay)
                return prev
            },
            {} as Record<
                string,
                {
                    mode: TTransportMode
                    label: string
                    quays: QuayWithFrontText[]
                }
            >,
        ),
    ).sort((a, b) => a.label.localeCompare(b.label, 'nb-NO'))

    if (quaysByTransportMode.length < 2) {
        quaysByTransportMode.forEach((group) => {
            const sortedQuays = [...group.quays].sort((a, b) => {
                const cmp = (a.publicCode || '').localeCompare(
                    b.publicCode || '',
                    'nb-NO',
                    { numeric: true },
                )
                if (cmp === 0) {
                    return b.lines.length - a.lines.length
                }
                return cmp
            })
            sortedQuays.forEach((quay) => {
                itemsToDistribute.push({
                    type: 'quay',
                    mode: group.mode,
                    data: quay,
                })
            })
        })
    } else {
        quaysByTransportMode.forEach((group) => {
            itemsToDistribute.push({ type: 'mode_group', data: group })
        })
    }

    itemsToDistribute.forEach((item) => {
        let height: number
        if (item.type === 'mode_group') {
            height =
                2 +
                item.data.quays.reduce(
                    (acc, q) => acc + 1 + q.lines.length,
                    0,
                ) +
                item.data.quays.length * 2
        } else {
            height = 1 + item.data.lines.length + 2
        }

        const minHeight = Math.min(...columnHeights)
        const colIndex = columnHeights.indexOf(minHeight)

        if (columns[colIndex] && typeof columnHeights[colIndex] === 'number') {
            columns[colIndex].push(item)
            columnHeights[colIndex] += height
        }
    })

    const modes = Array.from(new Set(Array.from(quayModesMap.values()).flat()))
        .filter((m): m is TTransportMode => !!m && m !== 'unknown')
        .sort((a, b) => {
            const labelA = transportModeNames(a) || ''
            const labelB = transportModeNames(b) || ''
            return labelA.localeCompare(labelB, 'nb-NO')
        })

    return { modes, quayModesMap, columns }
}

function SetVisibleLines({
    quays,
    trackingLocation,
}: {
    quays: QuayWithFrontText[]
    allLines: LineWithFrontText[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
}) {
    const posthog = usePosthogTracking()
    const tile = useNonNullContext(TileContext)

    const { modes, quayModesMap, columns } = sortAndDistributeColumnItems(quays)

    const [checkedLineIds, setCheckedLineIds] = useState<Set<string>>(() =>
        getInitialCheckedLineIds(tile, quays),
    )

    const totalQuayLinePairs = quays.reduce((sum, q) => sum + q.lines.length, 0)

    const handleToggleLine = (lineId: string) => {
        const newSet = new Set(checkedLineIds)
        if (newSet.has(lineId)) {
            newSet.delete(lineId)
        } else {
            newSet.add(lineId)
        }
        setCheckedLineIds(newSet)
    }

    const handleGroupToggle = (lineIds: string[], checked: boolean) => {
        const newSet = new Set(checkedLineIds)
        if (checked) {
            for (const id of lineIds) newSet.add(id)
        } else {
            for (const id of lineIds) newSet.delete(id)
        }
        setCheckedLineIds(newSet)
    }

    const toggleMode = (mode: TTransportMode) => {
        const keysOnActiveQuays: string[] = []
        const keysOnAllQuays: string[] = []
        for (const quay of quays) {
            const quayIsActive = quay.lines.some((l) =>
                checkedLineIds.has(`${quay.id}||${l.id}`),
            )

            for (const line of quay.lines) {
                if (line.transportMode === mode) {
                    keysOnAllQuays.push(`${quay.id}||${line.id}`)
                    if (quayIsActive) {
                        keysOnActiveQuays.push(`${quay.id}||${line.id}`)
                    }
                }
            }
        }

        const anySelected = keysOnActiveQuays.some((key) =>
            checkedLineIds.has(key),
        )

        const newSet = new Set(checkedLineIds)
        if (anySelected) {
            for (const key of keysOnActiveQuays) newSet.delete(key)
        } else {
            for (const key of keysOnAllQuays) newSet.add(key)
        }
        setCheckedLineIds(newSet)
    }

    const isModeSelected = (mode: TTransportMode) => {
        const keysInMode: string[] = []
        for (const q of quays) {
            const quayIsActive = q.lines.some((l) =>
                checkedLineIds.has(`${q.id}||${l.id}`),
            )
            if (!quayIsActive) continue

            for (const l of q.lines) {
                if (l.transportMode === mode) {
                    keysInMode.push(`${q.id}||${l.id}`)
                }
            }
        }
        if (keysInMode.length === 0) return false
        return keysInMode.some((key) => checkedLineIds.has(key))
    }

    return (
        <>
            <Heading4>Plattformer og linjer</Heading4>

            <div className="my-4 flex flex-row flex-wrap gap-4">
                {modes.map((mode) => {
                    const isSelected = isModeSelected(mode)

                    return (
                        <TransportModeChip
                            key={mode}
                            mode={mode}
                            isSelected={isSelected}
                            onClick={() => {
                                posthog.capture('stop_place_edit_interaction', {
                                    location: trackingLocation,
                                    field: 'transport_mode_filter',
                                    column_value: 'none',
                                    action: 'changed',
                                })
                                toggleMode(mode)
                            }}
                        />
                    )
                })}
            </div>

            <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
                {columns.map((colItems, index) => {
                    if (colItems.length === 0) return null

                    return (
                        <div
                            // biome-ignore lint/suspicious/noArrayIndexKey: Layout columns have no stable ID
                            key={`column-${index}`}
                            className="flex flex-1 flex-col gap-2"
                        >
                            {colItems.map((item) => {
                                if (item.type === 'mode_group') {
                                    const { mode, quays } = item.data
                                    return (
                                        <div
                                            key={mode}
                                            className="flex flex-col gap-2"
                                        >
                                            {quays
                                                .sort((a, b) => {
                                                    const cmp = (
                                                        a.publicCode || ''
                                                    ).localeCompare(
                                                        b.publicCode || '',
                                                        'nb-NO',
                                                        { numeric: true },
                                                    )
                                                    if (cmp === 0) {
                                                        return (
                                                            b.lines.length -
                                                            a.lines.length
                                                        )
                                                    }
                                                    return cmp
                                                })
                                                .map((quay) => {
                                                    const modes =
                                                        quayModesMap.get(
                                                            quay.id,
                                                        ) || []
                                                    const title =
                                                        quay.name &&
                                                        quay.publicCode
                                                            ? `${modes[0] === 'metro' || modes[0] === 'rail' ? 'Spor' : 'Plattform'} ${quay.publicCode}`
                                                            : quay.name ||
                                                              'Ukjent'

                                                    return (
                                                        <div key={quay.id}>
                                                            <PlatformAndLines
                                                                tile={tile}
                                                                quayId={quay.id}
                                                                groupKey={
                                                                    quay.publicCode ||
                                                                    quay.id
                                                                }
                                                                title={title}
                                                                description={
                                                                    quay.description
                                                                }
                                                                lines={
                                                                    quay.lines
                                                                }
                                                                trackingLocation={
                                                                    trackingLocation
                                                                }
                                                                transportModes={
                                                                    modes
                                                                }
                                                                selectedLineIds={
                                                                    checkedLineIds
                                                                }
                                                                onToggleLine={
                                                                    handleToggleLine
                                                                }
                                                                onToggleGroup={
                                                                    handleGroupToggle
                                                                }
                                                            />
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                    )
                                } else {
                                    const quay = item.data
                                    const modes =
                                        quayModesMap.get(quay.id) || []
                                    const title =
                                        quay.name && quay.publicCode
                                            ? `${modes[0] === 'metro' || modes[0] === 'rail' ? 'Spor' : 'Plattform'} ${quay.publicCode}`
                                            : quay.name || 'Ukjent'

                                    return (
                                        <div key={quay.id}>
                                            <PlatformAndLines
                                                tile={tile}
                                                quayId={quay.id}
                                                groupKey={
                                                    quay.publicCode || quay.id
                                                }
                                                title={title}
                                                description={quay.description}
                                                lines={quay.lines}
                                                trackingLocation={
                                                    trackingLocation
                                                }
                                                transportModes={modes}
                                                selectedLineIds={checkedLineIds}
                                                onToggleLine={handleToggleLine}
                                                onToggleGroup={
                                                    handleGroupToggle
                                                }
                                            />
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    )
                })}
            </div>
            <HiddenInput id="count" value={totalQuayLinePairs.toString()} />
        </>
    )
}

export { SetVisibleLines }
