import { number, type } from 'superstruct'

const TripPatternStruct = type({
    duration: number(),
    walkDistance: number(),
})

export { TripPatternStruct }
