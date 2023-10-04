import { TLinesFragment } from 'graphql/index'
import { uniqBy } from 'lodash'
import { TTransportMode } from 'types/graphql-schema'
import {
    isEntityInWhitelist,
    isWhitelistInactive,
    sortLineByPublicCode,
} from '../utils'
import { useCallback } from 'react'
import { TLineFragment } from '../types'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { useEditSettingsDispatch } from 'Admin/scenarios/Edit/utils/contexts'
import { xor } from 'lodash'

function useToggledLines(
    tile: TStopPlaceTile | TQuayTile,
    lines: TLinesFragment['lines'],
) {
    const dispatch = useEditSettingsDispatch()

    const allTransportModes: TTransportMode[] = uniqBy(
        lines,
        'transportMode',
    ).map((line) => line.transportMode ?? 'unknown')

    const uniqLines = uniqBy(lines, 'id')
    const allLineIDs = uniqLines.map((line) => line.id)

    const linesByModeSorted = allTransportModes
        .map((transportMode) => ({
            transportMode,
            lines: uniqLines
                .filter((line) => line.transportMode === transportMode)
                .sort(sortLineByPublicCode),
        }))
        .sort((a, b) => b.lines.length - a.lines.length)

    const toggleTransportMode = (transportMode: TTransportMode) => {
        if (isWhitelistInactive(tile.whitelistedTransportModes)) {
            return dispatch({
                type: 'setTransportModes',
                tileId: tile.uuid,
                transportModes: xor([transportMode], allTransportModes),
            })
        }
        if (
            isEntityInWhitelist(transportMode, tile.whitelistedTransportModes)
        ) {
            const newLines = linesByModeSorted
                .filter((e) => e.transportMode !== transportMode)
                .map((e) => e.lines.map((line) => line.id))
                .flat()
            dispatch({ type: 'setLines', tileId: tile.uuid, lines: newLines })
        }

        const newTransportModes = xor(
            [transportMode],
            tile.whitelistedTransportModes,
        )

        if (newTransportModes.length === allTransportModes.length)
            return dispatch({
                type: 'setTransportModes',
                tileId: tile.uuid,
            })

        dispatch({
            type: 'toggleTransportMode',
            tileId: tile.uuid,
            transportMode,
        })
    }

    const toggleLine = (line: TLineFragment) => {
        if (isWhitelistInactive(tile.whitelistedLines))
            return dispatch({
                type: 'setLines',
                tileId: tile.uuid,
                lines: xor([line.id], allLineIDs),
            })

        if (!isWhitelistInactive(tile.whitelistedTransportModes)) {
            const inherentlyEnabledLineIDs = linesByModeSorted
                .filter((e) =>
                    tile.whitelistedTransportModes?.includes(e.transportMode),
                )
                .map((e) => e.lines)
                .flat()
                .map((line) => line.id)
            return dispatch({
                type: 'setLines',
                tileId: tile.uuid,
                lines: xor([line.id], inherentlyEnabledLineIDs),
            })
        }

        const newLines = xor([line.id], tile?.whitelistedLines)

        if (newLines.length === allLineIDs.length)
            return dispatch({
                type: 'setLines',
                tileId: tile.uuid,
            })

        dispatch({ type: 'toggleLine', tileId: tile.uuid, lineId: line.id })
    }

    const isTransportModeToggled = useCallback(
        (transportMode: TTransportMode, lines: TLineFragment[]) => {
            const isLineWhitelistActive = !isWhitelistInactive(
                tile.whitelistedLines,
            )
            const isTransportModesWhitelistActive = !isWhitelistInactive(
                tile.whitelistedTransportModes,
            )
            const isTransportModeInWhitelist = isEntityInWhitelist(
                transportMode,
                tile.whitelistedTransportModes,
            )

            if (isLineWhitelistActive)
                return lines.some((line) =>
                    tile.whitelistedLines?.includes(line.id),
                )
                    ? 'indeterminate'
                    : false

            if (isTransportModesWhitelistActive)
                return isTransportModeInWhitelist

            return true
        },
        [tile],
    )

    const isLineToggled = useCallback(
        (line: TLineFragment) => {
            const isLineWhitelistActive = !isWhitelistInactive(
                tile.whitelistedLines,
            )
            const isTransportModesWhitelistActive = !isWhitelistInactive(
                tile.whitelistedTransportModes,
            )
            const isLineInWhitelist = isEntityInWhitelist(
                line.id,
                tile.whitelistedLines,
            )
            const isTransportModeInWhitelist = isEntityInWhitelist(
                line.transportMode ?? 'unknown',
                tile.whitelistedTransportModes,
            )

            if (isLineWhitelistActive) return isLineInWhitelist
            if (isTransportModesWhitelistActive)
                return isTransportModeInWhitelist

            return true
        },
        [tile],
    )

    return {
        linesByMode: linesByModeSorted,
        toggleTransportMode,
        toggleLine,
        isTransportModeToggled,
        isLineToggled,
    }
}

export { useToggledLines }
