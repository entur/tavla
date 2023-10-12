import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useState } from 'react'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { removeDuplicates } from './removeDuplicatesMultiSelect'
import { TLineFragment } from '../../SelectLines/types'

function getWhitelistedAuthorities(tile: TStopPlaceTile | TQuayTile) {
    return (
        tile.whitelistedAuthorities?.map(
            (authority) =>
                ({
                    value: authority.id,
                    label: authority.name,
                } as NormalizedDropdownItemType),
        ) ?? []
    )
}

function useAuthoritiesSearch(
    tile: TStopPlaceTile | TQuayTile,
    lines: TLineFragment[],
) {
    const [selectedAuthorities, setSelectedAuthorities] = useState(
        getWhitelistedAuthorities(tile),
    )
    const authoritiesList = removeDuplicates(
        lines.map((line) => {
            return {
                value: line.authority?.id || '',
                label: line.authority?.name || '',
            } as NormalizedDropdownItemType
        }),
    )

    const authorities = useCallback(() => authoritiesList, [authoritiesList])

    return { authorities, selectedAuthorities, setSelectedAuthorities }
}

export { useAuthoritiesSearch }
