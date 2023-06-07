import { TTile } from 'types/tile'

export type TAnonTile<T extends TTile> = Omit<T, 'uuid'>
