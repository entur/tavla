'use client'
import { BaseExpand, ExpandArrow } from '@entur/expand'
import { Checkbox } from '@entur/form'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import { getColorMode } from 'app/_components/TransportIcon/utils'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import type { TTransportMode } from 'src/types/graphql-schema'
import type { LineWithFrontText } from '../../utils/types'
import { sortLineFragment, transportModeNames } from '../utils'

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

export function TransportModeLines({
    mode,
    availableLines,
    trackingLocation,
    whitelistedLines,
    onToggleLine,
    onToggleGroup,
}: {
    mode: TTransportMode
    availableLines: LineWithFrontText[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    whitelistedLines: string[]
    onToggleLine: (lineId: string, checked: boolean) => void
    onToggleGroup: (checked: boolean) => void
}) {
    const { capture } = usePosthogTracking()
    const [isExpanded, setIsExpanded] = useState(false)
    const linesId = `transport-mode-${mode}`

    const allLineIds = availableLines.map((line) => line.id)
    const selectedIds = allLineIds.filter((id) => whitelistedLines.includes(id))

    const isAllSelected = selectedIds.length === allLineIds.length
    const isNoneSelected = selectedIds.length === 0
    const isIndeterminate = !isAllSelected && !isNoneSelected

    const handleToggleGroup = (checked: boolean) => {
        capture('stop_place_edit_interaction', {
            location: trackingLocation,
            field: 'stop_place_filter',
            column_value: 'none',
            action: checked ? 'select_all' : 'cleared',
        })
        onToggleGroup(checked)
    }

    const handleToggleLine = (lineId: string, checked: boolean) => {
        capture('stop_place_edit_interaction', {
            location: trackingLocation,
            field: 'stop_place_filter',
            column_value: 'none',
            action: 'changed',
        })
        onToggleLine(lineId, checked)
    }

    return (
        <div className="rounded-lg border-2 p-4">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center justify-start gap-2">
                    <TransportIcon
                        transportMode={mode}
                        background
                        whiteIcon
                        includeTooltip
                    />
                    <div className="flex flex-row flex-wrap items-center gap-x-2">
                        {transportModeNames(mode)}
                    </div>
                </div>
                <Checkbox
                    id={`select-all-${mode}`}
                    aria-label={`Velg alle linjer for ${transportModeNames(mode) ?? mode}`}
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
                {[...availableLines].sort(sortLineFragment).map((line) => (
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
