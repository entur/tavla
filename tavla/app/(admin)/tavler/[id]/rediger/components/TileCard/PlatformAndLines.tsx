'use client'
import { Checkbox } from '@entur/form'
import { TransportIcon } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/TransportIcon'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import { BoardTileDB } from 'src/types/db-types/boards'
import { TTransportMode } from 'src/types/graphql-schema'
import { TLineFragment } from './types'

function PlatformAndLines({
    tile,
    groupKey,
    title,
    lines,
    trackingLocation,
    transportMode,
}: {
    tile: BoardTileDB
    groupKey: string
    title: string
    lines: TLineFragment[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    transportMode: TTransportMode | null
}) {
    const posthog = usePosthogTracking()

    const lineElements = document.getElementsByName(`${tile.uuid}-${groupKey}`)

    const anyLineInWhitelist = lines.some((l) =>
        tile.whitelistedLines?.includes(l.id),
    )
    const missingLinesInWhitelist = lines.some(
        (l) => !tile.whitelistedLines?.includes(l.id),
    )

    const defaultChecked = () => {
        if (missingLinesInWhitelist && anyLineInWhitelist)
            return 'indeterminate'
        return (
            !tile.whitelistedLines ||
            tile.whitelistedLines.length === 0 ||
            !missingLinesInWhitelist
        )
    }
    const [checked, setChecked] = useState<boolean | 'indeterminate'>(
        defaultChecked(),
    )

    const determineAllChecked = () => {
        let count = 0
        for (const l of lineElements.values()) {
            if (l instanceof HTMLInputElement) {
                if (l.checked === true) count++
            }
        }
        if (count === 0) setChecked(false)
        else if (count < lineElements.length) setChecked('indeterminate')
        else setChecked(true)
    }

    return (
        <div className="rounded-lg border-2 p-4">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center justify-start gap-4 font-semibold">
                    <TransportIcon
                        transportMode={transportMode}
                        className={`h-7 w-7 text-white bg-${transportMode} rounded-md p-1`}
                    />
                    {title}
                </div>
                <Checkbox
                    checked={checked}
                    onChange={(e) => {
                        posthog.capture('stop_place_edit_interaction', {
                            location: trackingLocation,
                            field: 'lines',
                            column_value: 'none',
                            action: e.target.checked ? 'select_all' : 'cleared',
                        })
                        setChecked(e.currentTarget.checked)
                        lineElements.forEach((input) => {
                            if (input instanceof HTMLInputElement)
                                input.checked = e.currentTarget.checked
                        })
                    }}
                />
            </div>
            {checked &&
                lines.map((line) => (
                    <Checkbox
                        name={`${tile.uuid}-${groupKey}`}
                        defaultChecked={
                            !tile.whitelistedLines ||
                            tile.whitelistedLines.length === 0 ||
                            tile.whitelistedLines.includes(line.id)
                        }
                        key={line.id}
                        value={line.id}
                        className="pl-6"
                        onChange={() => {
                            posthog.capture('stop_place_edit_interaction', {
                                location: trackingLocation,
                                field: 'lines',
                                column_value: 'none',
                                action: 'changed',
                            })
                            determineAllChecked()
                        }}
                    >
                        <div className="flex flex-row items-center gap-1">
                            {line.publicCode && (
                                <div
                                    className={`publicCode bg-${transportMode} text-white`}
                                >
                                    {line.publicCode}
                                </div>
                            )}
                            {line.name}
                        </div>
                    </Checkbox>
                ))}
        </div>
    )
}

export { PlatformAndLines }
