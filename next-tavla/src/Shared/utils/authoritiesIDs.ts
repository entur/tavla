import { TQuayTile, TStopPlaceTile } from 'types/tile'

export function getWhitelistedAuthorities(tile: TStopPlaceTile | TQuayTile) {
    return tile.whitelistedAuthorities?.map((authority) => authority.id)
}
