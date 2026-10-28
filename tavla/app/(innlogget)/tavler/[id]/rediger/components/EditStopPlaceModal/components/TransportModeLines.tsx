'use client'
import { BaseExpand, ExpandArrow } from '@entur/expand'
import { Checkbox } from '@entur/form'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import {
    getColorMode,
    getTransportModesFromLines,
    sortByTransportMode,
} from 'app/_components/TransportIcon/utils'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import type { BoardTileDB } from 'src/types/db-types/boards'
import type { LineWithFrontText } from '../../utils/types'

function PublicCode({ line }: { line: LineWithFrontText }) {
    if (!line.publicCode) return null

    const color = getColorMode(
        line.transportMode ?? 'unknown',
        line.transportSubmode ?? 'unknown',
    )

    return (
        <div className={`publicCode bg-${color} text-white`}>
            {line.publicCode}
        </div>
    )
}

/**
 * Samme kort-UI som PlatformAndLines, men for én transportmiddel-gruppe på
 * tvers av alle plattformer. En linje kan dekkes av flere plattformer, derfor
 * kan getLineKeys returnere flere nøkler per linje — både linje- og
 * gruppe-checkboksen er tri-state over disse.
 */
export function TransportModeLines({
    tile,
    groupKey,
    title,
    lines,
    trackingLocation,
    selectedLineIds,
    getLineKeys,
    onToggleLine,
    onToggleGroup,
}: {
    tile: BoardTileDB
    groupKey: string
    title: string
    lines: LineWithFrontText[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    selectedLineIds: Set<string>
    getLineKeys: (line: LineWithFrontText) => string[]
    onToggleLine: (compositeKeys: string[], checked: boolean) => void
    onToggleGroup: (compositeKeys: string[], checked: boolean) => void
}) {
    const { capture } = usePosthogTracking()
    const [isExpanded, setIsExpanded] = useState(false)
    const linesId = `lines-${tile.uuid}-${groupKey}`

    const filterLineFragment = (line: LineWithFrontText) => {
        return !line.frontTexts || line.frontTexts.length > 0
    }

    const allKeysInGroup = lines.filter(filterLineFragment).flatMap(getLineKeys)

    const selectedKeysInGroup = allKeysInGroup.filter((key) =>
        selectedLineIds.has(key),
    )

    const isAllSelected =
        allKeysInGroup.length > 0 &&
        selectedKeysInGroup.length === allKeysInGroup.length
    const isNoneSelected = selectedKeysInGroup.length === 0
    const isIndeterminate = !isAllSelected && !isNoneSelected

    const compareLineFragment = (
        a: LineWithFrontText,
        b: LineWithFrontText,
    ) => {
        const codeA = a.publicCode || ''
        const codeB = b.publicCode || ''

        return codeA.localeCompare(codeB, undefined, { numeric: true })
    }

    const iconPairs =
        getTransportModesFromLines(lines).sort(sortByTransportMode)

    return (
        <div className="rounded-lg border-2 p-4">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center justify-start gap-2 pr-3 ">
                    <div className="flex flex-row gap-1 self-center">
                        {iconPairs.map((transportMode) => (
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
                    </div>
                    <div className="flex flex-row flex-wrap items-center gap-x-2">
                        {title}
                    </div>
                </div>
                <Checkbox
                    id={`select-all-${tile.uuid}-${groupKey}`}
                    checked={isIndeterminate ? 'indeterminate' : isAllSelected}
                    onChange={(e) => {
                        const checked = e.target.checked
                        capture('stop_place_edit_interaction', {
                            location: trackingLocation,
                            field: 'lines',
                            column_value: 'none',
                            action: checked ? 'select_all' : 'cleared',
                        })
                        onToggleGroup(allKeysInGroup, checked)
                    }}
                />
            </div>
            <button
                type="button"
                className="mt-2 flex flex-row items-center gap-1 text-sm text-[#626493]"
                aria-expanded={isExpanded}
                aria-controls={linesId}
                onClick={() => setIsExpanded((prev) => !prev)}
            >
                {isExpanded ? 'Skjul linjer' : 'Vis linjer'}
                <ExpandArrow open={isExpanded} />
            </button>
            <BaseExpand open={isExpanded} id={linesId}>
                {[...lines]
                    .sort(compareLineFragment)
                    .filter(filterLineFragment)
                    .map((line) => {
                        const keys = getLineKeys(line)
                        const selectedKeys = keys.filter((key) =>
                            selectedLineIds.has(key),
                        )
                        const lineChecked =
                            selectedKeys.length === 0
                                ? false
                                : selectedKeys.length === keys.length
                                  ? true
                                  : 'indeterminate'

                        return (
                            <Checkbox
                                key={line.id}
                                checked={lineChecked}
                                className="pl-1"
                                data-transport-mode={line.transportMode}
                                onChange={(e) => {
                                    capture('stop_place_edit_interaction', {
                                        location: trackingLocation,
                                        field: 'lines',
                                        column_value: 'none',
                                        action: 'changed',
                                    })
                                    onToggleLine(keys, e.target.checked)
                                }}
                            >
                                <div className="flex flex-row items-center gap-2">
                                    <PublicCode line={line} />
                                    {line.frontTexts.join(' / ')}
                                </div>
                            </Checkbox>
                        )
                    })}
            </BaseExpand>
        </div>
    )
}
