import { TLinesFragment } from 'graphql/index'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { MultiSelect, NormalizedDropdownItemType } from '@entur/dropdown'
import { useAuthoritiesSearch } from './useAuthoritiesSearch'
import { useEditSettingsDispatch } from '../../utils/contexts'
import { TAuthority } from 'types/graphql-schema'
function SelectAuthorities({
    tile,
    lines,
}: {
    tile: TStopPlaceTile | TQuayTile
    lines: TLinesFragment['lines']
}) {
    const dispatch = useEditSettingsDispatch()
    const { authorities, selectedAuthorities, setSelectedAuthorities } =
        useAuthoritiesSearch(tile, lines)

    function setAuthorities(newAuthorities: NormalizedDropdownItemType[]) {
        setSelectedAuthorities(newAuthorities)
        dispatch({
            type: 'setAuthorities',
            tileId: tile.uuid,
            authorities: newAuthorities.map(
                (authority) =>
                    ({
                        id: authority.value,
                        name: authority.label,
                    } as TAuthority),
            ),
        })
    }

    return (
        <MultiSelect
            label="Vis utvalgte operatører"
            items={authorities}
            selectedItems={selectedAuthorities}
            onChange={setAuthorities}
            hideSelectAll
        />
    )
}
export { SelectAuthorities }
