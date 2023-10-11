import { NormalizedDropdownItemType } from '@entur/dropdown'
import { TLinesFragment } from 'graphql/index'
import { useCallback, useState } from 'react'
import { TQuayTile, TStopPlaceTile } from 'types/tile'

function removeDuplicates(data: NormalizedDropdownItemType[]) {
    const unique: NormalizedDropdownItemType[] = []
    data.forEach((item) => {
        if (!unique.some((uniqueItem) => uniqueItem.label === item.label)) {
            unique.push(item)
        }
    })
    return unique
}

function getWhitelistedAuthorities(tile: TStopPlaceTile | TQuayTile) {
    return tile.whitelistedAuthorities
        ? tile.whitelistedAuthorities.map(
              (authority) =>
                  ({
                      value: authority.id,
                      label: authority.name,
                  } as NormalizedDropdownItemType),
          )
        : []
}

function useAuthoritiesSearch(
    tile: TStopPlaceTile | TQuayTile,
    lines: TLinesFragment['lines'],
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
