'use server'
import { getOrganization } from 'app/(admin)/actions'
import { nanoid } from 'nanoid'
import { TOrganizationID } from 'types/settings'
import { TTile } from 'types/tile'

export async function formDataToTile(data: FormData, oid?: TOrganizationID) {
    const quayId = data.get('quay') as string
    const stopPlaceId = data.get('stop_place') as string
    const stopPlaceName = data.get('stop_place_name') as string

    const placeId = quayId ? quayId : stopPlaceId

    const organization = await getOrganization(oid)
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
