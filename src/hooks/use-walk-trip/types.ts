import { number, type } from 'superstruct'

type WalkTrip = {
    duration: number
    walkDistance: number
}

const TripPatternStruct = type({
    duration: number(),
    walkDistance: number(),
})

export { TripPatternStruct }
export type { WalkTrip }
