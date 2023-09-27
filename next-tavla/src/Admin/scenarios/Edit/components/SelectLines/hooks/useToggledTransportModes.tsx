import { TLinesFragment } from 'graphql/index'
import { TTransportMode } from 'types/graphql-schema'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { uniqBy } from 'lodash'
import { useCallback } from 'react'
import { useEditSettingsDispatch } from 'Admin/scenarios/Edit/utils/contexts'
import {
    getMinimalTransportModesArray,
    isTransportModeInWhitelist,
    isWhitelistInactive,
} from '../utils'

function useToggledTransportModes(
    tile: TStopPlaceTile | TQuayTile,
    lines: TLinesFragment['lines'],
): [
    { transportMode: TTransportMode; toggled: boolean }[],
    (transportMode: TTransportMode) => void,
] {
    const dispatch = useEditSettingsDispatch()
    const allTransportModes: TTransportMode[] = uniqBy(
        lines,
        'transportMode',
    ).map((line) => line.transportMode ?? 'unknown')

    const isTransportModeToggled = useCallback(
        (transportMode: TTransportMode) => {
            const whitelist = tile.whitelistedTransportModes
            return (
                isWhitelistInactive(whitelist) ||
                isTransportModeInWhitelist(transportMode, whitelist)
            )
        },
        [tile.whitelistedTransportModes],
    )

    const toggleTransportMode = (transportMode: TTransportMode) => {
        const activeTransportModes = tile.whitelistedTransportModes ?? []

        const updatedTransportModes = getMinimalTransportModesArray(
            transportMode,
            activeTransportModes,
            allTransportModes,
        )

        dispatch({
            type: 'setTransportModes',
            tileId: tile.uuid,
            transportModes: updatedTransportModes,
        })
    }

    return [
        allTransportModes.map((transportMode) => {
            return {
                transportMode,
                toggled: isTransportModeToggled(transportMode),
            }
        }) ?? [],
        toggleTransportMode,
    ]
}

export { useToggledTransportModes }
