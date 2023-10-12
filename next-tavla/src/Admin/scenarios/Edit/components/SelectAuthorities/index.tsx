import { TLinesFragment } from 'graphql/index'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { MultiSelect, NormalizedDropdownItemType } from '@entur/dropdown'
import { useAuthoritiesSearch } from './utils/useAuthoritiesSearch'
import { useEditSettingsDispatch } from '../../utils/contexts'
import { TAuthority } from 'types/graphql-schema'
import { Heading4, SubParagraph } from '@entur/typography'
import classes from './styles.module.css'
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
        <div>
            <Heading4>Operatører</Heading4>
            <SubParagraph>
                Her kan du velge hvilke operatører som skal vises i Tavlen.
            </SubParagraph>
            <MultiSelect
                className={classes.multiSelect}
                label="Vis utvalgte operatører"
                items={authorities}
                selectedItems={selectedAuthorities}
                onChange={setAuthorities}
                hideSelectAll
                maxChips={3}
            />
        </div>
    )
}
export { SelectAuthorities }
