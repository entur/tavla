'use client'
import { Checkbox } from '@entur/form'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { SkeletonRectangle } from '@entur/loader'
import { Tooltip } from '@entur/tooltip'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import {
    getColorMode,
    getTransportModesFromLines,
    sortByTransportMode,
} from 'app/_components/TransportIcon/utils'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import type { BoardTileDB } from 'src/types/db-types/boards'
import type { TTransportMode } from 'src/types/graphql-schema'
import type { LineWithFrontText } from './types'
import { buildQuayLineFrontTextKey } from './utils'

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
    tile,
    quayId,
    groupKey,
    title,
    description,
    quayCodeTooltip,
    lines,
    trackingLocation,
    fallbackTransportModes: fallbackModes,
    selectedLineIds,
    onToggleLine,
    onToggleGroup,
}: {
    tile: BoardTileDB
    quayId: string
    groupKey: string
    title: string
    description: string | null
    quayCodeTooltip?: string | null
    lines: LineWithFrontText[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    fallbackTransportModes: TTransportMode[]
    selectedLineIds: Set<string>
    onToggleLine: (compositeKey: string) => void
    onToggleGroup: (compositeKeys: string[], checked: boolean) => void
}) {
    const { capture } = usePosthogTracking()

    const selectedLinesInGroup = lines.filter((l) =>
        l.frontTexts.some((frontText) =>
            selectedLineIds.has(
                buildQuayLineFrontTextKey(quayId, l.id, frontText),
            ),
        ),
    )
    const isAllSelected =
        lines.length > 0 && selectedLinesInGroup.length === lines.length
    const isNoneSelected = selectedLinesInGroup.length === 0
    const isIndeterminate = !isAllSelected && !isNoneSelected

    const compareLineFragment = (
        a: LineWithFrontText,
        b: LineWithFrontText,
    ) => {
        const modeA = a.transportMode || ''
        const modeB = b.transportMode || ''

        if (modeA !== modeB) {
            return modeA.localeCompare(modeB)
        }

        const codeA = a.publicCode || ''
        const codeB = b.publicCode || ''

        return codeA.localeCompare(codeB, undefined, {
            numeric: true,
        })
    }

    const filterLineFragment = (line: LineWithFrontText) => {
        return !line.frontTexts || line.frontTexts.length > 0
    }

    const transportModesFromLines = getTransportModesFromLines(lines)

    const iconPairs = (
        transportModesFromLines.length > 0
            ? transportModesFromLines
            : (fallbackModes?.map((m) => ({
                  transportMode: m,
                  transportSubmode: undefined,
              })) ?? [])
    ).sort(sortByTransportMode)

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
                    <div className="flex flex-row flex-wrap items-center gap-x-2 font-semibold">
                        {title}
                        {quayCodeTooltip && (
                            <Tooltip
                                className="font-normal"
                                content={quayCodeTooltip}
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
                        onToggleGroup(
                            lines.flatMap((l) =>
                                l.frontTexts.map((frontText) =>
                                    buildQuayLineFrontTextKey(
                                        quayId,
                                        l.id,
                                        frontText,
                                    ),
                                ),
                            ),
                            checked,
                        )
                    }}
                />
            </div>
            {[...lines]
                .sort(compareLineFragment)
                .filter(filterLineFragment)
                .flatMap((line) =>
                    line.frontTexts.map((frontText) => (
                        <Checkbox
                            key={buildQuayLineFrontTextKey(
                                quayId,
                                line.id,
                                frontText,
                            )}
                            value={buildQuayLineFrontTextKey(
                                quayId,
                                line.id,
                                frontText,
                            )}
                            checked={selectedLineIds.has(
                                buildQuayLineFrontTextKey(
                                    quayId,
                                    line.id,
                                    frontText,
                                ),
                            )}
                            className={`pl-3`}
                            name={`${tile.uuid}-lines`}
                            data-transport-mode={line.transportMode}
                            onChange={() => {
                                capture('stop_place_edit_interaction', {
                                    location: trackingLocation,
                                    field: 'lines',
                                    column_value: 'none',
                                    action: 'changed',
                                })
                                onToggleLine(
                                    buildQuayLineFrontTextKey(
                                        quayId,
                                        line.id,
                                        frontText,
                                    ),
                                )
                            }}
                        >
                            <div className="flex flex-row items-center gap-2">
                                <PublicCode line={line} />
                                {frontText}
                            </div>
                        </Checkbox>
                    )),
                )}
        </div>
    )
}
