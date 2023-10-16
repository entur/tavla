import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useState } from 'react'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { TLineFragment } from '../../SelectLines/types'
import { uniqBy } from 'lodash'

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
    const authoritiesList = uniqBy(
        lines.map((line) => {
            return {
                value: line.authority?.id || '',
                label: line.authority?.name || '',
            } as NormalizedDropdownItemType
        }),
        'value',
    )

    const authorities = useCallback(() => authoritiesList, [authoritiesList])

    return { authorities, selectedAuthorities, setSelectedAuthorities }
}

export { useAuthoritiesSearch }
