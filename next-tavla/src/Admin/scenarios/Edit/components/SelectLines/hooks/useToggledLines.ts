import { TLinesFragment } from 'graphql/index'
import { uniq, uniqBy } from 'lodash'
import { TTransportMode } from 'types/graphql-schema'
import {
    isEntityInWhitelist,
    isEveryEntityInArray,
    isSomeEntityInArray,
    isWhitelistInactive,
    sortLineByPublicCode,
} from '../utils'
import { TLineFragment } from '../types'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { useEditSettingsDispatch } from 'Admin/scenarios/Edit/utils/contexts'
import { xor } from 'lodash'

function useToggledLines(
    tile: TStopPlaceTile | TQuayTile,
    lines: TLinesFragment['lines'],
) {
    const dispatch = useEditSettingsDispatch()
    const setLines = (lines?: string[]) => {
        dispatch({ type: 'setLines', tileId: tile.uuid, lines })
    }

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

    const isAllLinesForModeToggled = (transportMode: TTransportMode) => {
        if (isWhitelistInactive(tile.whitelistedLines)) return true
        const allLinesForMode = linesByModeSorted
            .find((e) => e.transportMode === transportMode)
            ?.lines.map((line) => line.id)

        if (isEveryEntityInArray(allLinesForMode, tile.whitelistedLines)) {
            return true
        }
        if (isSomeEntityInArray(allLinesForMode, tile.whitelistedLines))
            return 'indeterminate'

        return false
    }

    const toggleAllLinesForMode = (transportMode: TTransportMode) => {
        const allLinesForMode = linesByModeSorted
            .find((e) => e.transportMode === transportMode)
            ?.lines.map((line) => line.id)

        if (isWhitelistInactive(tile.whitelistedLines)) {
            return setLines(xor(allLinesForMode, allLineIDs))
        }

        if (isEveryEntityInArray(allLinesForMode, tile.whitelistedLines))
            return setLines(xor(allLinesForMode, tile.whitelistedLines))

        const allLinesForModeIncluded = uniq(
            tile.whitelistedLines?.concat(allLinesForMode ?? []),
        )

        if (allLinesForModeIncluded.length === allLineIDs.length)
            return setLines()

        setLines(allLinesForModeIncluded)
    }

    const isLineToggled = (line: TLineFragment) => {
        if (isWhitelistInactive(tile.whitelistedLines)) return true
        return isEntityInWhitelist(line.id, tile.whitelistedLines)
    }

    const toggleLine = (line: TLineFragment) => {
        if (isWhitelistInactive(tile.whitelistedLines))
            return setLines(xor([line.id], allLineIDs))

        const newLines = xor([line.id], tile.whitelistedLines)

        if (newLines.length === allLineIDs.length) return setLines()

        setLines(newLines)
    }

    return {
        linesByMode: linesByModeSorted,
        isAllLinesForModeToggled,
        toggleAllLinesForMode,
        toggleLine,
        isLineToggled,
    }
}

export { useToggledLines }
