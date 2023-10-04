import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'
import { TBoard } from 'types/settings'
import classes from './styles.module.css'
import { useEditSettingsDispatch } from '../../utils/contexts'

function FontsizeSelector({ board }: { board: TBoard }) {
    const dispatch = useEditSettingsDispatch()
    return (
        <ChoiceChipGroup
            className={classes.choiceChipGroup}
            name="city"
            label="Velg tekststørrelse:"
            value={board.meta?.fontSize || 'medium'}
            onChange={(e) => {
                dispatch({
                    type: 'changeFontSize',
                    fontSize: e.target.value,
                })
            }}
        >
            <ChoiceChip value="small">Liten</ChoiceChip>
            <ChoiceChip value="medium">Medium</ChoiceChip>
            <ChoiceChip value="large">Stor</ChoiceChip>
        </ChoiceChipGroup>
    )
}
export { FontsizeSelector }
