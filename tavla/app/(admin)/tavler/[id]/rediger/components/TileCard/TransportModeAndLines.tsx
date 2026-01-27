'use client'
import { Checkbox } from '@entur/form'
import { TransportIcon } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/TransportIcon'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import { BoardTileDB } from 'src/types/db-types/boards'
import { TTransportMode } from 'src/types/graphql-schema'
import { TLineFragment } from './types'
import { transportModeNames } from './utils'

function TransportModeAndLines({
    tile,
    transportMode,
    lines,
    trackingLocation,
    board_id,
}: {
    tile: BoardTileDB
    transportMode: TTransportMode | null
    lines: TLineFragment[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    board_id: string
}) {
    const posthog = usePosthogTracking()

    const lineElements = document.getElementsByName(
        `${tile.uuid}-${transportMode}`,
    )

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
        <div>
            <div className="flex flex-row items-center justify-start gap-4 font-semibold">
                <TransportIcon
                    transportMode={transportMode}
                    className={`h-8 w-8 text-${transportMode}`}
                />
                {transportModeNames(transportMode)}
            </div>
            <div className="divider" />
            <div className="flex flex-row items-center">
                <Checkbox
                    checked={checked}
                    onChange={(e) => {
                        posthog.capture('stop_place_edit_interaction', {
                            location: trackingLocation,
                            board_id: board_id,
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
                >
                    Velg alle linjer
                </Checkbox>
            </div>
            {lines.map((line) => (
                <Checkbox
                    name={`${tile.uuid}-${transportMode}`}
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
                            board_id: board_id,
                            field: 'lines',
                            column_value: 'none',
                            action: 'changed',
                        })
                        determineAllChecked()
                    }}
                >
                    <div className="flex flex-row items-center gap-1">
                        {line.publicCode && (
                            <div className="publicCode">{line.publicCode}</div>
                        )}
                        {line.name}
                    </div>
                </Checkbox>
            ))}
        </div>
    )
}

export { TransportModeAndLines }
