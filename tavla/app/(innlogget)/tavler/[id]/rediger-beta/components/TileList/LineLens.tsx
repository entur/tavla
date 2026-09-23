'use client'
import { BaseExpand } from '@entur/expand'
import { Checkbox } from '@entur/form'
import type {
    LineWithFrontText,
    QuayWithFrontText,
} from 'app/_components/TileCard/types'
import { transportModeNames } from 'app/_components/TileCard/utils'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import { useState } from 'react'
import { quayTag } from './quayDisplay'
import { lineKeys, type useStopPlaceSelection } from './useStopPlaceSelection'

type Selection = ReturnType<typeof useStopPlaceSelection>

type DirectionRow = {
    key: string
    frontText: string | null
    quay: QuayWithFrontText
}

type LineGroup = {
    lineId: string
    line: LineWithFrontText
    rows: DirectionRow[]
}

function buildLineGroups(quays: QuayWithFrontText[]): LineGroup[] {
    const groups = new Map<string, LineGroup>()

    for (const quay of quays) {
        for (const line of quay.lines) {
            const keys = lineKeys(quay.id, line)
            const frontTexts =
                line.frontTexts.length > 0 ? line.frontTexts : [null]

            const group = groups.get(line.id) ?? {
                lineId: line.id,
                line,
                rows: [],
            }
            frontTexts.forEach((frontText, index) => {
                group.rows.push({
                    key: keys[index] as string,
                    frontText,
                    quay,
                })
            })
            groups.set(line.id, group)
        }
    }

    return Array.from(groups.values()).sort((a, b) => {
        const modeA = a.line.transportMode ?? ''
        const modeB = b.line.transportMode ?? ''
        if (modeA !== modeB) return modeA.localeCompare(modeB)
        return (a.line.publicCode ?? '').localeCompare(
            b.line.publicCode ?? '',
            'nb-NO',
            { numeric: true },
        )
    })
}

function LineRow({
    group,
    selection,
    onChanged,
}: {
    group: LineGroup
    selection: Selection
    onChanged: () => void
}) {
    const keys = group.rows.map((row) => row.key)
    const state = selection.keysTriState(keys)
    const [expanded, setExpanded] = useState(state === 'some')

    const selectedCount = group.rows.filter((row) =>
        selection.isSelected(row.key),
    ).length

    const checked =
        state === 'all' ? true : state === 'some' ? 'indeterminate' : false

    const { line } = group

    return (
        <div className="rounded-lg border-2 p-4">
            <div className="flex flex-row items-center justify-between gap-3">
                <button
                    type="button"
                    className="flex min-w-0 flex-1 flex-row items-center gap-2 text-left"
                    aria-expanded={expanded}
                    onClick={() => setExpanded((prev) => !prev)}
                >
                    <TransportIcon
                        transportMode={line.transportMode}
                        transportSubmode={line.transportSubmode ?? undefined}
                        size={4}
                    />
                    {line.publicCode && (
                        <span className="font-semibold">{line.publicCode}</span>
                    )}
                    <span className="min-w-0 truncate">
                        {line.name || transportModeNames(line.transportMode)}
                    </span>
                    <span className="whitespace-nowrap text-sm text-[#626493]">
                        {selectedCount} av {group.rows.length} retninger
                    </span>
                </button>
                <Checkbox
                    checked={checked}
                    aria-label={`Velg alle retninger for linje ${line.publicCode ?? line.name ?? ''}`}
                    onChange={() => {
                        selection.toggleKeys(keys)
                        onChanged()
                    }}
                />
            </div>

            <BaseExpand open={expanded}>
                <div className="mt-2 flex flex-col gap-1 pl-2">
                    {group.rows.map((row) => (
                        <Checkbox
                            key={row.key}
                            checked={selection.isSelected(row.key)}
                            onChange={() => {
                                selection.toggleKey(row.key)
                                onChanged()
                            }}
                        >
                            <span className="flex flex-row flex-wrap items-center gap-2">
                                <span>{row.frontText ?? 'Alle retninger'}</span>
                                <span className="rounded border px-2 py-0.5 text-xs text-[#626493]">
                                    {quayTag(row.quay)}
                                </span>
                            </span>
                        </Checkbox>
                    ))}
                </div>
            </BaseExpand>
        </div>
    )
}

export function LineLens({
    quays,
    selection,
    onChanged,
}: {
    quays: QuayWithFrontText[]
    selection: Selection
    onChanged: () => void
}) {
    const groups = buildLineGroups(quays)

    return (
        <div className="flex flex-col gap-3">
            {groups.map((group) => (
                <LineRow
                    key={group.lineId}
                    group={group}
                    selection={selection}
                    onChanged={onChanged}
                />
            ))}
        </div>
    )
}
