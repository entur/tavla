import { number, string, type, is, literal } from 'superstruct'
import { PlaceAtDistanceEdgeFragment } from '../../../graphql-generated/journey-planner-v3'

interface NearestStopPlace {
    id: string
    distance: number
    type: 'StopPlace'
    latitude: number
    longitude: number
}

const EdgeStruct = type({
    node: type({
        distance: number(),
        place: type({
            __typename: literal('StopPlace'),
            id: string(),
            latitude: number(),
            longitude: number(),
        }),
    }),
})

const toEdge = (edgeFragment: PlaceAtDistanceEdgeFragment | null) => {
    if (is(edgeFragment, EdgeStruct)) {
        return edgeFragment
    }
    return null
}

export { toEdge, EdgeStruct }
export type { NearestStopPlace }
