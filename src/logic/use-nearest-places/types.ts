import { number, string, type, is } from 'superstruct'
import { UseNearestPlaces_EdgeFragment } from '../../../graphql-generated/journey-planner-v3'

interface NearestPlace {
    id: string
    distance: number
    type: string
    latitude: number
    longitude: number
}

const EdgeStruct = type({
    node: type({
        distance: number(),
        place: type({
            __typename: string(),
            id: string(),
            latitude: number(),
            longitude: number(),
        }),
    }),
})

const toEdge = (edgeFragment: UseNearestPlaces_EdgeFragment | null) => {
    if (is(edgeFragment, EdgeStruct)) {
        return edgeFragment
    }
    return undefined
}

export { toEdge, EdgeStruct }
export type { NearestPlace }
