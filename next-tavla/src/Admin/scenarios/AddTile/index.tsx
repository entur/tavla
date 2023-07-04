import React, { useState } from 'react'
import { TTileType } from 'types/tile'
import { Button } from '@entur/button'
import { RadioGroup, RadioPanel } from '@entur/form'
import classes from './styles.module.css'
import { AddStopPlaceTile } from './components/AddStopPlaceTile'
import { AddQuayTile } from './components/AddQuayTile'
import { TAnonTiles } from 'Admin/types'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { DefaultColumns } from 'types/tile'

const components: Record<
    TTileType,
    (props: { setTile: (tile: TAnonTiles) => void }) => JSX.Element
> = {
    stop_place: AddStopPlaceTile,
    quay: AddQuayTile,
}

function AddTile() {
    const [tileType, setTileType] = useState<TTileType>('stop_place')
    const [tile, setTile] = useState<TAnonTiles>()

    const Component = components[tileType]

    const dispatch = useSettingsDispatch()

    return (
        <div className={classes.AddTile}>
            <RadioGroup
                name="tile-type"
                label="Legg til ny rute"
                onChange={(e) => {
                    setTileType(e.target.value as TTileType)
                }}
                value={tileType}
            >
                <div className={classes.RadioCards}>
                    <RadioPanel title="Stoppested" value="stop_place">
                        Rute med alle avganger for et stoppested.
                    </RadioPanel>
                    <RadioPanel title="Plattform" value="quay">
                        Rute med avganger for en valgt platform/retning.
                    </RadioPanel>
                </div>
            </RadioGroup>
            <Component setTile={setTile} />
            {tile && (
                <Button
                    variant="primary"
                    onClick={() => {
                        dispatch({
                            type: 'addTile',
                            tile: { ...tile, columns: [...DefaultColumns] },
                        })
                    }}
                >
                    Legg til
                </Button>
            )}
        </div>
    )
}

export { AddTile }
