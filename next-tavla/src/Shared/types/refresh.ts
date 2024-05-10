import { TBoard } from './settings'

export type TRefresh = {
    type: 'refresh'
    payload: TBoard
}

export type TUpdate = {
    type: 'update'
}

export type TMessage = TRefresh | TUpdate
