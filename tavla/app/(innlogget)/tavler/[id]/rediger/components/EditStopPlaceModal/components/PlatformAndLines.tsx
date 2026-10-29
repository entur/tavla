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
import { sortLineFragment } from '../utils'

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

export function PlatformAndLines({
    quayId,
    title,
    description,
    tooltip,
    availableLines,
    trackingLocation,
    whitelistedLines,
    onToggleLine,
    onToggleGroup,
}: {
    quayId: string
    title: string
    availableLines: LineWithFrontText[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    whitelistedLines: string[]
    onToggleLine: (quayId: string, lineId: string, checked: boolean) => void
    onToggleGroup: (quayId: string, checked: boolean) => void
    description?: string
    tooltip?: string
}) {
    const { capture } = usePosthogTracking()
    const [isExpanded, setIsExpanded] = useState(false)
    const linesId = `lines-${quayId}`

    const filterLineFragment = (line: LineWithFrontText) => {
        return !line.frontTexts || line.frontTexts.length > 0
    }

    const allLineIdsInGroup = availableLines
        .filter(filterLineFragment)
        .map((l) => l.id)
    const selectedIdsInGroup = allLineIdsInGroup.filter((id) =>
        whitelistedLines.includes(id),
    )

    const isAllSelected = selectedIdsInGroup.length === allLineIdsInGroup.length
    const isNoneSelected = selectedIdsInGroup.length === 0
    const isIndeterminate = !isAllSelected && !isNoneSelected

    const transportModesFromLines =
        getTransportModesFromLines(availableLines).sort(sortByTransportMode)

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
                    checked={isIndeterminate ? 'indeterminate' : isAllSelected}
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
                {[...availableLines]
                    .sort(sortLineFragment)
                    .filter(filterLineFragment)
                    .map((line) => (
                        <Checkbox
                            key={line.id}
                            checked={whitelistedLines.includes(line.id)}
                            className="ml-1"
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
                    ))}
            </BaseExpand>
        </div>
    )
}
