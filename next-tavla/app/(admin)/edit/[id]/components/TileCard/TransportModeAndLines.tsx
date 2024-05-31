'use client'
import { TTransportMode } from 'types/graphql-schema'
import { TTile } from 'types/tile'
import { TransportIcon } from 'components/TransportIcon'
import { transportModeNames } from './utils'
import { Checkbox } from '@entur/form'
import { TLineFragment } from './types'
import { useState } from 'react'

function TransportModeAndLines({
    tile,
    transportMode,
    lines,
}: {
    tile: TTile
    transportMode: TTransportMode | null
    lines: TLineFragment[]
}) {
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

    return (
        <div>
            <div className="flex flex-row gap-4 items-center justify-start font-semibold">
                <TransportIcon
                    transportMode={transportMode}
                    className="w-8 h-8"
                />
                {transportModeNames(transportMode)}
            </div>
            <div className="border-b-secondary border-b-2 my-2" />
            <div className="flex flex-row items-center">
                <Checkbox
                    checked={checked}
                    onChange={(e) => {
                        setChecked(e.currentTarget.checked)
                        lineElements.forEach((input) => {
                            if (input instanceof HTMLInputElement)
                                input.checked = e.currentTarget.checked
                        })
                    }}
                >
                    Velg alle
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
                        let count = 0
                        for (const l of lineElements.values()) {
                            if (l instanceof HTMLInputElement) {
                                if (l.checked === true) count++
                            }
                        }
                        if (count === 0) setChecked(false)
                        else if (count < lineElements.length)
                            setChecked('indeterminate')
                        else setChecked(true)
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
