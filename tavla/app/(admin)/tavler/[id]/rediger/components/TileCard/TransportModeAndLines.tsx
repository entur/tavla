'use client'
import { Checkbox } from '@entur/form'
import { TileContext } from 'Board/scenarios/Table/contexts'
import { TransportIcon } from 'components/TransportIcon'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { useEffect, useState } from 'react'
import { TTransportMode } from 'types/graphql-schema'
import { TTile } from 'types/tile'
import { TLineFragment } from './types'
import { transportModeNames } from './utils'

export function getDefaultChecked(tile: TTile, lines: TLineFragment[]) {
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
    return defaultChecked
}

function TransportModeAndLines({
    lines,
    transportMode,
}: {
    lines: TLineFragment[]
    transportMode: TTransportMode | null
}) {
    const tile = useNonNullContext(TileContext)
    const [checked, setChecked] = useState<boolean | 'indeterminate'>()
    // useEffect(() => {
    //     setChecked((prev) => {
    //         if (prev) {
    //             return prev
    //         }
    //         else return getDefaultChecked(tile, lines),
    //         // return prev
    //     })
    // }, [lines, tile])

    // const missingLinesInWhitelist = lines.some(
    //     (l) => !tile.whitelistedLines?.includes(l.id),
    // )
    const [checkedLines, setCheckedLines] = useState<Record<string, boolean>>(
        {},
    )
    useEffect(() => {
        setCheckedLines((prev) => {
            // only initialize if prev is still empty
            if (Object.keys(prev).length === 0) {
                return Object.fromEntries(
                    lines.map((line) => [
                        line.id,
                        tile.whitelistedLines?.includes(line.id) ?? false,
                    ]),
                )
            }
            return prev
        })
    }, [lines, tile.whitelistedLines])

    const lineElements = document.getElementsByName(
        `${tile.uuid}-${transportMode}`,
    )
    const determineAllChecked = () => {
        // let checkedLinesCount = 0
        // Object.keys(checkedLines).map((checkedLine) => {
        //     if (checkedLines[checkedLine] === true) {
        //         checkedLinesCount += 1
        //     }
        // })

        // if (checkedLinesCount === 0) setChecked(false)
        // else if (checkedLinesCount < lineElements.length)
        //     setChecked('indeterminate')
        // else setChecked(checkedLinesCount === lineElements.length)
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

    // const determineIsThisChecked = (elementName: string) => {
    //     const input = document.getElementsByName(elementName)[0]
    //     if (input instanceof HTMLInputElement) {
    //         return input.checked
    //     } else return false
    // }

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
                        setChecked(e.currentTarget.checked)
                        lineElements.forEach((input) => {
                            if (input instanceof HTMLInputElement)
                                input.checked = e.currentTarget.checked
                        })
                        Object.keys(checkedLines).forEach(
                            (line) =>
                                (checkedLines[line] = e.currentTarget.checked),
                        )
                    }}
                >
                    Velg alle linjer
                </Checkbox>
            </div>
            {lines.map((line) => (
                <Checkbox
                    name={`${tile.uuid}-${transportMode}`}
                    // defaultChecked={
                    //     !tile.whitelistedLines ||
                    //     tile.whitelistedLines.length === 0 ||
                    //     tile.whitelistedLines.includes(line.id)
                    // }
                    checked={checkedLines[line.id]}
                    key={line.id}
                    value={line.id}
                    className="pl-6"
                    onChange={(e) => {
                        determineAllChecked()
                        setCheckedLines({
                            ...checkedLines,
                            [line.id]: e.currentTarget.checked,
                        })
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
