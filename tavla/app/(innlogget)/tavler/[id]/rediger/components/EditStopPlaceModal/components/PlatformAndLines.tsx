'use client'
import { BaseExpand, ExpandArrow } from '@entur/expand'
import { Checkbox } from '@entur/form'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import {
    getColorMode,
    getTransportModesFromLines,
    sortByTransportMode,
} from 'app/_components/TransportIcon/utils'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import type { LineWithFrontText } from '../../utils/types'
import { generateQuayLineKey, sortLineFragment } from '../utils'

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

function isLineSelected(
    lineId: string,
    selectedLineIds: string[],
    isGroupSelected: boolean,
): boolean {
    if (isGroupSelected && selectedLineIds.length === 0) return true

    return selectedLineIds.includes(lineId)
}

export function PlatformAndLines({
    quayId,
    title,
    description,
    tooltip,
    lines,
    trackingLocation,
    selectedLineIds,
    onToggleLine,
    onToggleGroup,
    isGroupSelected,
}: {
    quayId: string
    title: string
    lines: LineWithFrontText[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    selectedLineIds: string[]
    onToggleLine: (quayId: string, lineId: string, checked: boolean) => void
    onToggleGroup: (quayId: string, checked: boolean) => void
    isGroupSelected: boolean
    description?: string
    tooltip?: string
}) {
    const { capture } = usePosthogTracking()
    const [isExpanded, setIsExpanded] = useState(false)
    const linesId = `TODO`

    const filterLineFragment = (line: LineWithFrontText) => {
        return !line.frontTexts || line.frontTexts.length > 0
    }

    const transportModesFromLines =
        getTransportModesFromLines(lines).sort(sortByTransportMode)

    const handleToggleGroup = (checked: boolean) => {
        capture('stop_place_edit_interaction', {
            location: trackingLocation,
            field: 'lines',
            column_value: 'none',
            action: checked ? 'select_all' : 'cleared',
        })
        onToggleGroup(quayId, checked)
    }

    const handleToggleLine = (lineId: string, checked: boolean) => {
        capture('stop_place_edit_interaction', {
            location: trackingLocation,
            field: 'lines',
            column_value: 'none',
            action: 'changed',
        })
        onToggleLine(quayId, lineId, checked)
    }

    const isIntermediate = selectedLineIds.length > 0

    return (
        <div className="rounded-lg border-2 p-4">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center justify-start gap-2">
                    <div className="flex flex-row gap-1 self-center">
                        {transportModesFromLines.map((transportMode) => (
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
                        {tooltip && (
                            <Tooltip
                                className="font-normal"
                                content={tooltip}
                                placement="top"
                                id={`tooltip-quay-code-${quayId}`}
                            >
                                <ValidationInfoFilledIcon
                                    size={20}
                                    aria-labelledby={`tooltip-quay-code-${quayId}`}
                                />
                            </Tooltip>
                        )}
                        {description && (
                            <span className="text-sm font-normal text-[#626493]">
                                {description}
                            </span>
                        )}
                    </div>
                </div>
                <Checkbox
                    id={`select-all-${quayId}`}
                    checked={isIntermediate ? 'indeterminate' : isGroupSelected}
                    onChange={(e) => handleToggleGroup(e.target.checked)}
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
                    .sort(sortLineFragment)
                    .filter(filterLineFragment)
                    .map((line) => {
                        const key = generateQuayLineKey(quayId, line.id)

                        return (
                            <Checkbox
                                key={key}
                                checked={selectedLineIds.includes(line.id)}
                                className="pl-1"
                                data-transport-mode={line.transportMode}
                                onChange={(e) =>
                                    handleToggleLine(line.id, e.target.checked)
                                }
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
