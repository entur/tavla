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

    const linesByModeSorted = allTransportModes
        .map((transportMode) => ({
            transportMode,
            lines: uniqLines
                .filter((line) => line.transportMode === transportMode)
                .sort(sortLineByPublicCode),
        }))
        .sort((a, b) => b.lines.length - a.lines.length)

    const toggleTransportMode = useCallback(
        (transportMode: TTransportMode) => {
            if (!isWhitelistInactive(tile.whitelistedTransportModes))
                return dispatch({
                    type: 'setTransportModes',
                    tileId: tile.uuid,
                    transportModes: xor([transportMode], allTransportModes),
                })

            dispatch({
                type: 'toggleTransportMode',
                tileId: tile.uuid,
                transportMode,
            })
        },
        [dispatch],
    )

    const toggleLine = useCallback(
        (line: TLineFragment, lines: TLineFragment[]) => {
            if (
                isEntityInWhitelist(
                    line.transportMode ?? 'unknown',
                    tile.whitelistedTransportModes,
                )
            )
                dispatch({
                    type: 'toggleTransportMode',
                    tileId: tile.uuid,
                    transportMode: line.transportMode ?? 'unknown',
                })
            dispatch({ type: 'toggleLine', tileId: tile.uuid, lineId: line.id })
        },
        [tile],
    )

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

            return 'inherently-enabled'
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
                return isTransportModeInWhitelist ? 'inherently-enabled' : false

            return 'inherently-enabled'
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
