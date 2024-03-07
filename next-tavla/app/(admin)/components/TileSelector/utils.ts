import { nanoid } from 'nanoid'
import { TOrganization } from 'types/settings'
import { TTile } from 'types/tile'

export function formDataToTile(data: FormData, organization?: TOrganization) {
    const quayId = data.get('quay') as string
    const stopPlaceId = data.get('stop_place') as string
    const stopPlaceName = data.get('stop_place_name') as string

    const placeId = quayId ? quayId : stopPlaceId

    return {
        type: placeId !== stopPlaceId ? 'quay' : 'stop_place',
        name: stopPlaceName,
        uuid: nanoid(),
        placeId,
        columns: organization?.defaults?.columns ?? [
            'line',
            'destination',
            'time',
            'realtime',
        ],
    } as TTile
}
