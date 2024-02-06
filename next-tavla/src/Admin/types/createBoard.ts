import { TOrganizationID } from 'types/settings'

export type TCreatePage = {
    step: 'addStops'
    oid: TOrganizationID | undefined
}

export type TCreateBoard = 'name' | 'stops'
