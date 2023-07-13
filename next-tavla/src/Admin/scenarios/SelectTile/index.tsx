import { TQuayTile, TStopPlaceTile, TTile } from 'types/tile'
import { Heading2, Paragraph } from '@entur/typography'
import classes from './styles.module.css'
import { RadioGroup } from '@entur/form'
import { ChangeEvent } from 'react'
import { useQuery } from 'graphql/utils'
import { QuayNameQuery, StopPlaceNameQuery } from 'graphql/index'
import { RadioOption } from './components/RadioOption'

function StopPlaceRadioOption({ tile }: { tile: TStopPlaceTile }) {
    const { data, isLoading } = useQuery(StopPlaceNameQuery, {
        id: tile.placeId,
    })

    const name = data?.stopPlace?.name ?? tile.placeId

    return <RadioOption isLoading={isLoading} name={name} uuid={tile.uuid} />
}

function QuayRadioOption({ tile }: { tile: TQuayTile }) {
    const { data, isLoading } = useQuery(QuayNameQuery, {
        id: tile.placeId,
    })

    const name =
        (data?.quay?.name ?? tile.placeId) + data?.quay?.publicCode
            ? ' - ' + data?.quay?.publicCode
            : ''

    return <RadioOption isLoading={isLoading} name={name} uuid={tile.uuid} />
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
        <div className={classes.selectTileSection}>
            <Heading2 className={classes.heading}>
                Holdeplasser i avgangstavlen
            </Heading2>
            <div data-cy="tiles">
                {!tiles.length ? (
                    <Paragraph className={classes.emptyTilesMessage}>
                        Du må legge til en holdeplass for at den skal vises her.
                        Bruk søkefeltet og trykk “legg til”.
                    </Paragraph>
                ) : (
                    <RadioGroup
                        name="select-tile"
                        value={selectedTileId || null}
                        onChange={handleTileSelected}
                    >
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
                    </RadioGroup>
                )}
            </div>
        </div>
    )
}

export { SelectTile }
