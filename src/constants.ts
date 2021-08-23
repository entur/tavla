export const WALK_SPEED = 1.4
export const MAX_DISTANCE = 1000
export const DEFAULT_DISTANCE = 500
export const REFRESH_INTERVAL = 30000
export enum VehicleOperator {
    BOLT = 'YBO:Operator:bolt',
    LIME = 'YLI:Operator:lime',
    VOI = 'YVO:Operator:voi',
    TIER = 'YTI:Operator:Tier',
    BERGEN_BYSYKKEL = 'YBE:Operator:bergenbysykkel',
    KOLUMBUS_BYSYKKEL = 'YKO:Operator:kolumbusbysykkel',
    OSLO_BYSYKKEL = 'YOS:Operator:oslobysykkel',
    TRONDHEIM_BYSYKKEL = 'YTR:Operator:trondheimbysykkel',
}
export const ALL_OPERATORS = Object.values(VehicleOperator)
export const DEFAULT_ZOOM = 15.5
