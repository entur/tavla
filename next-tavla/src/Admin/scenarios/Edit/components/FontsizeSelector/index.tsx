import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'
import { TBoard } from 'types/settings'
import { useEditSettingsDispatch } from '../../utils/contexts'
import { TFontSize } from 'types/meta'
import { defaultFontSize } from 'Board/scenarios/Board/utils'
import { Heading4 } from '@entur/typography'

function FontsizeSelector({ board }: { board: TBoard }) {
    const dispatch = useEditSettingsDispatch()
    return (
        <div className="flexColumn g-1">
            <Heading4 className="m-0">Velg tekststørrelse: </Heading4>
            <ChoiceChipGroup
                className="flexRow"
                name="city"
                value={board.meta?.fontSize || defaultFontSize(board)}
                onChange={(e) => {
                    dispatch({
                        type: 'changeFontSize',
                        fontSize: e.target.value as TFontSize,
                    })
                }}
            >
                <ChoiceChip value="small">Liten</ChoiceChip>
                <ChoiceChip value="medium">Medium</ChoiceChip>
                <ChoiceChip value="large">Stor</ChoiceChip>
            </ChoiceChipGroup>
        </div>
    )
}
export { FontsizeSelector }
