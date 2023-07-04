import { TMapTile, TQuayTile, TStopPlaceTile, TTile } from 'types/tile'

export type TAnon<T extends TTile> = Omit<T, 'uuid'>

export type TAnonTiles =
    | TAnon<TQuayTile>
    | TAnon<TStopPlaceTile>
    | TAnon<TMapTile>
