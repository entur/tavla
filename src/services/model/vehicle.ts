import { Codespace } from './codespace'
import { Line } from './line'
import { Operator } from './operator'
import { ServiceJourney } from './serviceJourney'

export type Vehicle = {
    vehicleRef: string
    codespace: Codespace
    operator: Operator
    line: Line
    serviceJourney: ServiceJourney
    direction: string | number
    mode: string
    lastUpdated: string
    lastUpdatedEpochSecond: number
    expiration: string
    expirationEpochSecond: number
    speed: number
    heading: number
    monitored: boolean
    delay: number
    location: {
        latitude: number
        longitude: number
    }
}
