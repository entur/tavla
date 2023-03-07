import { number, type } from 'superstruct'

const WalkTripStruct = type({
    duration: number(),
    walkDistance: number(),
})

export { WalkTripStruct }
