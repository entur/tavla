import { getFormFeedbackForError } from 'app/(admin)/utils'
import { WalkDistanceQuery } from 'graphql/index'
import { fetchQuery } from 'graphql/utils'
import { nanoid } from 'nanoid'
import { DEFAULT_ORGANIZATION_COLUMNS } from 'types/column'
import { TLocation } from 'types/meta'
import { TOrganization } from 'types/settings'
import { TTile } from 'types/tile'

export function formDataToTile(data: FormData, organization?: TOrganization) {
    const quayId = data.get('quay') as string
    const stopPlaceId = data.get('stop_place') as string
    const stopPlaceName = (data.get('stop_place_name') as string).split(',')
    const quayName = data.get('quay_name') as string

    const placeId = quayId ? quayId : stopPlaceId
    return {
        type: placeId !== stopPlaceId ? 'quay' : 'stop_place',
        name: `${stopPlaceName[0]}${
<<<<<<< HEAD
            quayName === 'Vis alle' ? '' : ' ' + quayName.trim()
=======
            quayName === 'Vis alle' ? '' : ' ' + quayName
>>>>>>> 4e2302aa (feat(tiles): add platform to tile name)
        }, ${stopPlaceName[1]}`,
        uuid: nanoid(),
        placeId,
        columns:
            organization?.defaults?.columns ?? DEFAULT_ORGANIZATION_COLUMNS,
    } as TTile
}

export async function getWalkingDistance(
    placeId?: string,
    location?: TLocation,
) {
    if (!placeId) return getFormFeedbackForError()
    if (!location) return undefined
    try {
        const response = await fetchQuery(WalkDistanceQuery, {
            placeId: placeId,
            location: {
                longitude: location.coordinate?.lng ?? 0,
                latitude: location.coordinate?.lat ?? 0,
            },
        })
        return response.trip.tripPatterns[0]?.duration
    } catch (error) {
        return getFormFeedbackForError()
    }
}
