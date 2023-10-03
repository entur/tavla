import classes from './styles.module.css'
import { Heading2 } from '@entur/typography'
import { TertiarySquareButton } from '@entur/button'
import { AddIcon, SubtractIcon } from '@entur/icons'
import { TTile } from 'types/tile'
import { useEditSettingsDispatch } from '../../utils/contexts'
import {
    MAX_NUMBER_OF_DEPARTURES,
    MIN_NUMBER_OF_DEPARTURES,
} from 'Admin/utils/constants'

function RowsSelector({ tile }: { tile: TTile }) {
    const dispatch = useEditSettingsDispatch()
    return (
        <div className={classes.selectorWrapper}>
            <Heading2 className={classes.heading}>
                Antall avganger som vises:{' '}
            </Heading2>
            <div className={classes.selector}>
                <TertiarySquareButton
                    disabled={
                        tile.numberOfDepartures == MIN_NUMBER_OF_DEPARTURES
                    }
                    aria-label="Fjern en rad fra tavla"
                    onClick={() =>
                        dispatch({
                            type: 'setNumberOfDepartures',
                            tileId: tile.uuid,
                            numberOfDepartures: tile.numberOfDepartures - 1,
                        })
                    }
                >
                    <SubtractIcon />
                </TertiarySquareButton>
                {tile.numberOfDepartures}
                <TertiarySquareButton
                    disabled={
                        tile.numberOfDepartures == MAX_NUMBER_OF_DEPARTURES
                    }
                    aria-label="Legg til en rad til tavla"
                    onClick={() =>
                        dispatch({
                            type: 'setNumberOfDepartures',
                            tileId: tile.uuid,
                            numberOfDepartures: tile.numberOfDepartures + 1,
                        })
                    }
                >
                    <AddIcon />
                </TertiarySquareButton>
            </div>
        </div>
    )
}
export { RowsSelector }
