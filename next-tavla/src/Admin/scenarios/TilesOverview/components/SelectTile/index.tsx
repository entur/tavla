import { TTile } from 'types/tile'
import { DeleteButton } from '../DeleteButton'
import { Heading2 } from '@entur/typography'
import classes from './styles.module.css'
import { RadioGroup, RadioPanel } from '@entur/form'
import { ChangeEvent } from 'react'

function SelectTile({
    tiles,
    selectedTileId,
    selectTile,
}: {
    tiles: TTile[]
    selectedTileId?: string
    selectTile: (tile: TTile) => void
}) {
    function handleTileSelected(e: ChangeEvent<HTMLInputElement>) {
        const tileuuId = e.target.value
        const selectedTile = tiles.find((tile) => tile.uuid === tileuuId)
        if (selectedTile) selectTile(selectedTile)
    }

    return (
        <div>
            <Heading2 className={classes.heading}>
                Holdeplasser i avgangstavlen
            </Heading2>
            <RadioGroup
                name="select-tile"
                value={selectedTileId || null}
                onChange={handleTileSelected}
            >
                <div className={classes.stopPlaceList}>
                    {tiles.map((tile) => {
                        return (
                            <RadioPanel
                                hideRadioButton
                                title=""
                                value={tile.uuid}
                                key={tile.uuid}
                                className={classes.radioOption}
                            >
                                <div className={classes.radioOptionWrapper}>
                                    {'Jernbanetorget'}
                                    <DeleteButton uuid={tile.uuid} />
                                </div>
                            </RadioPanel>
                        )
                    })}
                </div>
            </RadioGroup>
        </div>
    )
}

export { SelectTile }
