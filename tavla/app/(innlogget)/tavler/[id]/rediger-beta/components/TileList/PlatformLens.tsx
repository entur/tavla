'use client'
import { BaseExpand } from '@entur/expand'
import { Checkbox } from '@entur/form'
import { ValidationInfoIcon } from '@entur/icons'
import type { QuayWithFrontText } from 'app/_components/TileCard/types'
import { transportModeNames } from 'app/_components/TileCard/utils'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import {
    getTransportModesFromLines,
    sortByTransportMode,
} from 'app/_components/TransportIcon/utils'
import { useState } from 'react'
import { quayTitle } from './quayDisplay'
import type { useStopPlaceSelection } from './useStopPlaceSelection'

type Selection = ReturnType<typeof useStopPlaceSelection>

function QuayCard({
    quay,
    selection,
    onChanged,
}: {
    quay: QuayWithFrontText
    selection: Selection
    onChanged: () => void
}) {
    const state = selection.quayState(quay)
    const [expanded, setExpanded] = useState(state === 'some')

    const iconPairs = getTransportModesFromLines(quay.lines).sort(
        sortByTransportMode,
    )
    const checked =
        state === 'all' ? true : state === 'some' ? 'indeterminate' : false

    return (
        <div className="rounded-lg border-2 p-4">
            <div className="flex flex-row items-start justify-between gap-3">
                <div className="flex min-w-0 flex-row items-center gap-2">
                    <div className="flex flex-row gap-1 self-center">
                        {iconPairs.map((pair) => (
                            <TransportIcon
                                key={`${pair.transportMode}|${pair.transportSubmode ?? ''}`}
                                transportMode={pair.transportMode}
                                transportSubmode={pair.transportSubmode}
                                background
                                whiteIcon
                                includeTooltip
                            />
                        ))}
                    </div>
                    <div className="flex min-w-0 flex-col">
                        <span className="font-semibold">{quayTitle(quay)}</span>
                        {quay.description && (
                            <span className="text-sm text-[#626493]">
                                {quay.description}
                            </span>
                        )}
                    </div>
                </div>
                <Checkbox
                    checked={checked}
                    aria-label={`Vis alle avganger fra ${quayTitle(quay)}`}
                    onChange={(e) => {
                        selection.toggleQuayAll(quay, e.target.checked)
                        onChanged()
                    }}
                />
            </div>

            {state === 'all' && (
                <p className="mt-2 flex flex-row items-center gap-1 text-sm text-[#626493]">
                    <ValidationInfoIcon size={16} />
                    Viser alle {quay.lines.length} linjer
                </p>
            )}

            <button
                type="button"
                className="mt-2 text-sm underline"
                aria-expanded={expanded}
                onClick={() => setExpanded((prev) => !prev)}
            >
                {expanded ? 'Skjul linjer' : 'Velg enkeltlinjer'}
            </button>

            <BaseExpand open={expanded}>
                <div className="mt-2 flex flex-col gap-1 pl-2">
                    {quay.lines.map((line) => {
                        const lineChecked =
                            selection.lineState(quay, line) === 'all'
                        const color =
                            transportModeNames(line.transportMode) ?? 'Ukjent'
                        return (
                            <Checkbox
                                key={line.id}
                                checked={lineChecked}
                                onChange={() => {
                                    selection.toggleLine(quay, line)
                                    onChanged()
                                }}
                            >
                                <span className="flex flex-row items-center gap-2">
                                    <TransportIcon
                                        transportMode={line.transportMode}
                                        transportSubmode={
                                            line.transportSubmode ?? undefined
                                        }
                                        size={4}
                                    />
                                    {line.publicCode && (
                                        <span className="font-semibold">
                                            {line.publicCode}
                                        </span>
                                    )}
                                    <span className="text-[#626493]">
                                        {color}
                                    </span>
                                    {line.name && <span>{line.name}</span>}
                                </span>
                            </Checkbox>
                        )
                    })}
                </div>
            </BaseExpand>
        </div>
    )
}

export function PlatformLens({
    quays,
    selection,
    onChanged,
}: {
    quays: QuayWithFrontText[]
    selection: Selection
    onChanged: () => void
}) {
    return (
        <div className="flex flex-col gap-3">
            {quays.map((quay) => (
                <QuayCard
                    key={quay.id}
                    quay={quay}
                    selection={selection}
                    onChanged={onChanged}
                />
            ))}
        </div>
    )
}
