import { Tile } from 'components/Tile'
import { TMapTile } from 'types/tile'

function MapTile({ placeId }: TMapTile) {
    return <Tile>{placeId}</Tile>
}

export { MapTile }
