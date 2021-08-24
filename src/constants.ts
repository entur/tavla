import { Operator } from '@entur/sdk/lib/mobility/types'

import fetchOperators from './logic/fetchOperators'

export const WALK_SPEED = 1.4
export const MAX_DISTANCE = 1000
export const DEFAULT_DISTANCE = 500
export const REFRESH_INTERVAL = 30000
export const ALL_ACTIVE_OPERATOR_IDS = {
    BOLT: 'YBO:Operator:bolt',
    LIME: 'YLI:Operator:lime',
    VOI: 'YVO:Operator:voi',
    TIER: 'YTI:Operator:Tier',
}
export const ALL_ACTIVE_OPERATORS: Operator[] = fetchOperators(
    Object.values(ALL_ACTIVE_OPERATOR_IDS),
)
export const DEFAULT_ZOOM = 15.5
