import { Heading4, SubParagraph } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { Columns, TColumn } from 'types/column'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import classes from './styles.module.css'
import { isArray } from 'lodash'
import { FilterChip } from '@entur/chip'

function ToggleColumns({ tile }: { tile: TStopPlaceTile | TQuayTile }) {
    const dispatch = useSettingsDispatch()

    function handleSwitch(column: TColumn) {
        dispatch({
            type: 'setColumn',
            column: column,
            tileId: tile.uuid,
        })
    }
    return (
        <div className={classes.columnSettings}>
            <Heading4>Tabellen</Heading4>
            <SubParagraph>
                Her bestemmer du hvilke kolonner som skal vises i Tavlen.
            </SubParagraph>
            <div className={classes.columnFilters}>
                {Object.entries(Columns).map(([key, value]) => {
                    return (
                        <FilterChip
                            key={key}
                            value={value}
                            checked={
                                isArray(tile.columns)
                                    ? tile.columns?.includes(key as TColumn)
                                    : false
                            }
                            onChange={() => handleSwitch(key as TColumn)}
                        >
                            {value}
                        </FilterChip>
                    )
                })}
            </div>
        </div>
    )
}

export { ToggleColumns }
