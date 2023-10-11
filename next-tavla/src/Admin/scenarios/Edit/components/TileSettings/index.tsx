import { TTile } from 'types/tile'
import { StopPlaceSettings } from './StopPlaceSettings'
import { QuaySettings } from './QuaySettings'

function TileSettings({ tile }: { tile?: TTile; name?: string }) {
    if (tile?.type === 'stop_place') return <StopPlaceSettings tile={tile} />
    if (tile?.type === 'quay') return <QuaySettings tile={tile} />
    return null
}

export { TileSettings }
