'use client'
import { Checkbox } from '@entur/form'
import { SkeletonRectangle } from '@entur/loader'
import { TransportIcon } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/TransportIcon'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { BoardTileDB } from 'src/types/db-types/boards'
import { TTransportMode } from 'src/types/graphql-schema'
import { FeatureFlags } from '../../../../../../posthog/featureFlags'
import { LineWithFrontText } from './types'

function PublicCode({ line }: { line: LineWithFrontText }) {
    if (!line.publicCode) return null

    const color = line.transportSubmode?.startsWith('airport')
        ? 'air'
        : line.transportMode

    return (
        <div className={`publicCode bg-${color} text-white`}>
            {line.publicCode}
        </div>
    )
}

function DisplayName({
    line,
    showByFrontText,
}: {
    line: LineWithFrontText
    showByFrontText: boolean | undefined
}) {
    if (showByFrontText) {
        if (line.frontTexts) {
            return <>{line.frontTexts.join(' / ')}</>
        }
        return <SkeletonRectangle width="6rem" height="1rem" />
    }
    return <>{line.name ?? ''}</>
}

function PlatformAndLines({
    tile,
    quayId,
    groupKey,
    title,
    description,
    lines,
    trackingLocation,
    transportModes,
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
    transportModes: TTransportMode[]
    selectedLineIds: Set<string>
    onToggleLine: (compositeKey: string) => void
    onToggleGroup: (compositeKeys: string[], checked: boolean) => void
}) {
    const posthog = usePosthogTracking()

    const isShowLinesByFrontTextEnabled = useFeatureFlagEnabled(
        FeatureFlags.ShowLinesByFrontText,
    )

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
        if (isShowLinesByFrontTextEnabled) {
            return !line.frontTexts || line.frontTexts.length > 0
        } else {
            return true
        }
    }

    return (
        <div className="rounded-lg border-2 p-4">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center justify-start gap-2 pr-3 font-semibold">
                    <div className="flex flex-row gap-1 self-center">
                        {transportModes.map((mode) => (
                            <TransportIcon
                                key={mode}
                                transportMode={mode}
                                className={`h-7 w-7 rounded-md bg-${mode} p-1 text-white`}
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
                            <DisplayName
                                line={line}
                                showByFrontText={isShowLinesByFrontTextEnabled}
                            />
                        </div>
                    </Checkbox>
                ))}
        </div>
    )
}

export { PlatformAndLines }
