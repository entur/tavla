export const DEFAULT_DISTANCE = 500
export const REFRESH_INTERVAL = 30000
export const ALL_ACTIVE_OPERATOR_IDS: Record<string, string> = {
    VOI: 'YVO:Operator:voi',
    TIER: 'YTI:Operator:Tier',
    BOLT: 'YBO:Operator:bolt',
}
export const DEFAULT_ZOOM = 15.5

//Realtime data
export const INACTIVE_VEHICLE_IN_SECONDS = 60
export const EXPIRE_VEHICLE_IN_SECONDS = 600
export const SWEEP_INTERVAL_MS = 1000
export const BUFFER_SIZE = 20
export const BUFFER_TIME = 200
export const DEFAULT_FETCH_POLICY = 'no-cache'

// Client name for calling the API
export const CLIENT_NAME = process.env.CLIENT_NAME || ''
if (!CLIENT_NAME && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(
        'CLIENT_NAME is missing! Please set a client name in your environment config.',
    )
}

// Layout breakpoints
export const BREAKPOINTS = {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
}
