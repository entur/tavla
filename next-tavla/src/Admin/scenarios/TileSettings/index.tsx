import { TTile } from 'types/tile'
import { StopPlaceSettings } from './components/StopPlaceSettings'

function TileSettings({ tile }: { tile?: TTile }) {
    if (!tile || tile.type === 'quay') return <p>dette er en quay</p>

    return <StopPlaceSettings tile={tile} />
}

export { TileSettings }
