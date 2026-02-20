import { Heading4 } from '@entur/typography'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { TransportIcon } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/TransportIcon'
import { TileContext } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/context'
import { EventProps } from 'app/posthog/events'
import { useEffect, useState } from 'react'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import { TQuay, TTransportMode } from 'src/types/graphql-schema'
import { PlatformAndLines } from '../PlatformAndLines'
import { TLineFragment } from '../types'
import { transportModeNames } from '../utils'

function SetVisibleLines({
    quays,
    trackingLocation,
}: {
    quays: TQuay[]
    allLines: TLineFragment[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
}) {
    const tile = useNonNullContext(TileContext)
    const quayModesMap = new Map<string, TTransportMode[]>()

    // Initialize checked lines based on whitelist logic.
    // Keys are composite "${quayId}||${lineId}" to allow independent selection per quay.
    const [checkedLineIds, setCheckedLineIds] = useState<Set<string>>(() => {
        const set = new Set<string>()
        const hasQuayFilter = tile.quays && tile.quays.length > 0

        quays.forEach((quay) => {
            const savedQuay = tile.quays?.find((q) => q.id === quay.id)
            if (savedQuay) {
                // Explicitly whitelisted quay: only its saved lines are selected
                savedQuay.whitelistedLines.forEach((lineId) =>
                    set.add(`${quay.id}||${lineId}`),
                )
            } else if (hasQuayFilter) {
                // Per-quay filter exists but this quay has no entry: nothing selected
            } else if (
                tile.whitelistedLines &&
                tile.whitelistedLines.length > 0
            ) {
                // Legacy: tile-level whitelist with no per-quay config
                quay.lines
                    .filter((l) => tile.whitelistedLines!.includes(l.id))
                    .forEach((l) => set.add(`${quay.id}||${l.id}`))
            } else {
                // No filter at all: all lines selected
                quay.lines.forEach((l) => set.add(`${quay.id}||${l.id}`))
            }
        })
        return set
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedLines, setSelectedLines] = useState<string[]>([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedQuays, setSelectedQuays] = useState<string[]>([])

    const totalQuayLinePairs = quays.reduce((sum, q) => sum + q.lines.length, 0)

    // Update outputs based on checked lines
    useEffect(() => {
        const activeQuayIds = new Set<string>()
        quays.forEach((q) => {
            const hasSelectedLines = q.lines.some((l) =>
                checkedLineIds.has(`${q.id}||${l.id}`),
            )
            if (hasSelectedLines) {
                activeQuayIds.add(q.id)
            }
        })

        if (activeQuayIds.size === quays.length) {
            setSelectedQuays([])
        } else {
            setSelectedQuays(Array.from(activeQuayIds))
        }
    }, [checkedLineIds, quays])

    quays.forEach((quay) => {
        const modes = Array.from(
            new Set(
                quay.lines
                    .map((l) => l.transportMode as TTransportMode)
                    .filter((m) => !!m && m !== 'unknown'),
            ),
        )

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
        quayModesMap.set(quay.id, uniqueModes)
    })

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
                { mode: TTransportMode; label: string; quays: TQuay[] }
            >,
        ),
    ).sort((a, b) => a.label.localeCompare(b.label))

    const allModes = Array.from(
        new Set(Array.from(quayModesMap.values()).flat()),
    )
        .filter((m): m is TTransportMode => !!m && m !== 'unknown')
        .sort((a, b) => {
            const labelA = transportModeNames(a) || ''
            const labelB = transportModeNames(b) || ''
            return labelA.localeCompare(labelB, 'nb-NO')
        })

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
            lineIds.forEach((id) => newSet.add(id))
        } else {
            lineIds.forEach((id) => newSet.delete(id))
        }
        setCheckedLineIds(newSet)
    }

    const toggleMode = (mode: TTransportMode) => {
        const keysInMode: string[] = []
        quays.forEach((quay) => {
            quay.lines.forEach((line) => {
                if (line.transportMode === mode) {
                    keysInMode.push(`${quay.id}||${line.id}`)
                }
            })
        })

        const allSelected = keysInMode.every((key) => checkedLineIds.has(key))

        const newSet = new Set(checkedLineIds)
        if (allSelected) {
            keysInMode.forEach((key) => newSet.delete(key))
        } else {
            keysInMode.forEach((key) => newSet.add(key))
        }
        setCheckedLineIds(newSet)
    }

    const isModeSelected = (mode: TTransportMode) => {
        const keysInMode: string[] = []
        quays.forEach((q) => {
            q.lines.forEach((l) => {
                if (l.transportMode === mode) {
                    keysInMode.push(`${q.id}||${l.id}`)
                }
            })
        })
        if (keysInMode.length === 0) return false
        return keysInMode.every((key) => checkedLineIds.has(key))
    }

    return (
        <>
            <Heading4>Plattformer og linjer</Heading4>

            <div className="mb-4 mt-2 flex flex-row flex-wrap gap-2">
                {allModes.map((mode) => {
                    const isSelected = isModeSelected(mode)
                    const label = transportModeNames(mode) || 'Ukjent'

                    return (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => toggleMode(mode)}
                            className={`flex flex-row items-center gap-2 rounded-full border px-3 py-1 transition-colors ${
                                isSelected
                                    ? `bg-${mode} text-white border-${mode}`
                                    : 'border-slate-300 bg-white text-slate-700'
                            }`}
                        >
                            {isSelected && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-4 w-4"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                            {label}
                            <TransportIcon
                                transportMode={mode}
                                className={`h-4 w-4 ${isSelected ? 'text-white' : `text-${mode}`}`}
                            />
                        </button>
                    )
                })}
            </div>

            <div
                className={`flex flex-col gap-8 ${
                    quaysByTransportMode.length > 1 ? 'md:flex-row' : ''
                }`}
            >
                {quaysByTransportMode.map(({ mode, quays }) => (
                    <div
                        key={mode}
                        className={
                            quaysByTransportMode.length === 1
                                ? 'block columns-1 gap-8 md:columns-2 lg:columns-3'
                                : 'flex flex-col gap-4'
                        }
                    >
                        {quays
                            .sort((a, b) =>
                                (a.publicCode || '').localeCompare(
                                    b.publicCode || '',
                                    'nb-NO',
                                    { numeric: true },
                                ),
                            )
                            .map((quay) => {
                                const modes = quayModesMap.get(quay.id) || []
                                const title =
                                    quay.name && quay.publicCode
                                        ? `${modes.includes('metro') || modes.includes('rail') ? 'Spor' : 'Plattform'} ${quay.publicCode}`
                                        : quay.name || 'Ukjent'

                                return (
                                    <div
                                        key={quay.id}
                                        className={
                                            quaysByTransportMode.length === 1
                                                ? 'mb-4 break-inside-avoid'
                                                : ''
                                        }
                                    >
                                        <PlatformAndLines
                                            tile={tile}
                                            quayId={quay.id}
                                            groupKey={
                                                quay.publicCode || quay.id
                                            }
                                            title={title}
                                            lines={quay.lines}
                                            trackingLocation={trackingLocation}
                                            transportModes={modes}
                                            selectedLineIds={checkedLineIds}
                                            onToggleLine={handleToggleLine}
                                            onToggleGroup={handleGroupToggle}
                                        />
                                    </div>
                                )
                            })}
                    </div>
                ))}
            </div>
            <HiddenInput id="count" value={totalQuayLinePairs.toString()} />
        </>
    )
}

export { SetVisibleLines }
