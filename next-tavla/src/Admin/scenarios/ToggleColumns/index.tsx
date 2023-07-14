import { Heading4, SubParagraph } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { Columns, DefaultColumns, TColumn } from 'types/column'
import { TTile } from 'types/tile'
import { Switch } from '@entur/form'
import classes from './styles.module.css'

function ToggleColumns({ tile }: { tile: TTile }) {
    const dispatch = useSettingsDispatch()

    const optionalColumns: TColumn[] = ['platform', 'via']

    function handleSwitch(column: TColumn, value: boolean) {
        dispatch({
            type: 'setColumn',
            column: column,
            value: value,
            tileId: tile.uuid,
        })
    }
    const columns = { ...DefaultColumns, ...tile.columns }
    return (
        <div>
            <Heading4>Legg til ekstra detaljer i tabellen</Heading4>
            <SubParagraph>
                Linje, destinasjon, avvik og avgangstid vil alltid vises i
                tabellen. <br />
                Her kan du legge til ekstra detaljer i denne holdeplassen sin
                tabell.
            </SubParagraph>
            <div className={classes.columnToggleWrapper}>
                {optionalColumns.map((col) => {
                    return (
                        <Switch
                            key={col}
                            checked={columns[col]}
                            onChange={() => handleSwitch(col, !columns[col])}
                        >
                            {Columns[col]}
                        </Switch>
                    )
                })}
            </div>
        </div>
    )
}

export { ToggleColumns }
