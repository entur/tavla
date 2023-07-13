import { TQuayTile, TStopPlaceTile, TTile } from 'types/tile'
import { DeleteButton } from '../DeleteButton'
import { Heading2 } from '@entur/typography'
import classes from './styles.module.css'
import { RadioGroup, RadioPanel } from '@entur/form'
import { ChangeEvent } from 'react'
import { useQuery } from 'graphql/utils'
import { QuayNameQuery, StopPlaceNameQuery } from 'graphql/index'
import { Loader } from '@entur/loader'

function StopPlaceRadioOption({ tile }: { tile: TStopPlaceTile }) {
    const { data, isLoading } = useQuery(StopPlaceNameQuery, {
        id: tile.placeId,
    })

    const name = !data ? data : data.stopPlace?.name ?? tile.placeId

    return (
        <RadioPanel
            hideRadioButton
            disabled={isLoading}
            title=""
            value={tile.uuid}
            className={classes.radioOption}
        >
            <div className={classes.radioOptionWrapper}>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        {name}
                        <DeleteButton uuid={tile.uuid} />
                    </>
                )}
            </div>
        </RadioPanel>
    )
}

function QuayRadioOption({ tile }: { tile: TQuayTile }) {
    const { data, isLoading } = useQuery(QuayNameQuery, {
        id: tile.placeId,
    })

    const name = !data
        ? data
        : (data.quay?.name ?? tile.placeId) +
          ' - ' +
          (data.quay?.description ?? data.quay?.publicCode)

    return (
        <RadioPanel
            hideRadioButton
            disabled={isLoading}
            title=""
            value={tile.uuid}
            className={classes.radioOption}
        >
            <div className={classes.radioOptionWrapper}>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        {name}
                        <DeleteButton uuid={tile.uuid} />
                    </>
                )}
            </div>
        </RadioPanel>
    )
}

function SelectTile({
    tiles,
    selectedTileId,
    selectTile,
}: {
    tiles: TTile[]
    selectedTileId?: string
    selectTile: (uuid: string) => void
}) {
    function handleTileSelected(e: ChangeEvent<HTMLInputElement>) {
        const tileuuId = e.target.value
        selectTile(tileuuId)
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
                        switch (tile.type) {
                            case 'stop_place':
                                return (
                                    <StopPlaceRadioOption
                                        tile={tile}
                                        key={tile.uuid}
                                    />
                                )
                            case 'quay':
                                return (
                                    <QuayRadioOption
                                        tile={tile}
                                        key={tile.uuid}
                                    />
                                )
                        }
                    })}
                </div>
            </RadioGroup>
        </div>
    )
}

export { SelectTile }
