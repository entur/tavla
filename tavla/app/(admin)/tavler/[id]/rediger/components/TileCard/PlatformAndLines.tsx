'use client'
import { Checkbox } from '@entur/form'
import { SkeletonRectangle } from '@entur/loader'
import { TransportIcon } from 'app/(admin)/components/TransportIcon'
import {
    getColorMode,
    getRelevantSubmode,
    sortByTransportMode,
} from 'app/(admin)/components/TransportIcon/utils'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import type { BoardTileDB } from 'src/types/db-types/boards'
import type { TTransportMode } from 'src/types/graphql-schema'
import type { LineWithFrontText } from './types'

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

function DisplayName({ line }: { line: LineWithFrontText }) {
    if (line.frontTexts) {
        return <>{line.frontTexts.join(' / ')}</>
    }
    return <SkeletonRectangle width="6rem" height="1rem" />
}

function PlatformAndLines({
    tile,
    quayId,
    groupKey,
    title,
    description,
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
    lines: LineWithFrontText[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    fallbackTransportModes: TTransportMode[]
    selectedLineIds: Set<string>
    onToggleLine: (compositeKey: string) => void
    onToggleGroup: (compositeKeys: string[], checked: boolean) => void
}) {
    const posthog = usePosthogTracking()

    const selectedLinesInGroup = lines.filter((l) =>
        selectedLineIds.has(`${quayId}||${l.id}`),
    )
    const isAllSelected =
        lines.length > 0 && selectedLinesInGroup.length === lines.length
    const isNoneSelected = selectedLinesInGroup.length === 0
    const isIndeterminate = !isAllSelected && !isNoneSelected
    const showLines = !isNoneSelected

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

    const transportModesFromLines = Object.values(
        Object.fromEntries(
            lines.flatMap((line) =>
                line.transportMode
                    ? [
                          [
                              `${line.transportMode}|${getRelevantSubmode(line.transportSubmode) ?? ''}`,
                              {
                                  transportMode: line.transportMode,
                                  transportSubmode: getRelevantSubmode(
                                      line.transportSubmode ?? undefined,
                                  ),
                              },
                          ],
                      ]
                    : [],
            ),
        ),
    )

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
                <div className="flex flex-row items-center justify-start gap-2 pr-3 font-semibold">
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
                            />
                        ))}
                    </div>
                    <div className="flex flex-row flex-wrap items-baseline gap-x-2">
                        {title}
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
                        posthog.capture('stop_place_edit_interaction', {
                            location: trackingLocation,
                            field: 'lines',
                            column_value: 'none',
                            action: checked ? 'select_all' : 'cleared',
                        })
                        onToggleGroup(
                            lines.map((l) => `${quayId}||${l.id}`),
                            checked,
                        )
                    }}
                />
            </div>
            {[...lines]
                .sort(compareLineFragment)
                .filter(filterLineFragment)
                .map((line) => (
                    <Checkbox
                        key={line.id}
                        value={`${quayId}||${line.id}`}
                        checked={selectedLineIds.has(`${quayId}||${line.id}`)}
                        className={`pl-3 ${showLines ? '' : 'hidden'}`}
                        name={`${tile.uuid}-lines`}
                        data-transport-mode={line.transportMode}
                        onChange={() => {
                            posthog.capture('stop_place_edit_interaction', {
                                location: trackingLocation,
                                field: 'lines',
                                column_value: 'none',
                                action: 'changed',
                            })
                            onToggleLine(`${quayId}||${line.id}`)
                        }}
                    >
                        <div className="flex flex-row items-center gap-2">
                            <PublicCode line={line} />
                            <DisplayName line={line} />
                        </div>
                    </Checkbox>
                ))}
        </div>
    )
}

export { PlatformAndLines }
