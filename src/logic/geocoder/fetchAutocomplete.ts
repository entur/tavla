import { Coordinates } from 'src/types'
import { CLIENT_NAME } from '../../constants'
import { GeocoderResults } from './types'

const endpoint = process.env.GEOCODER_HOST ?? 'https://api.entur.io/geocoder/v1'

type AutocompleteItem = {
    value: string
    label: string
    coordinates?: Coordinates
}

async function fetchAutocomplete(
    searchString: string,
): Promise<AutocompleteItem[]> {
    if (searchString.trim() === '') return []

    return fetch(
        `${endpoint}/autocomplete?text=${searchString}&lang=no&layers=venue`,
        {
            headers: new Headers({
                'ET-Client-Name': CLIENT_NAME,
            }),
        },
    )
        .then((response) => response.json())
        .then((result: GeocoderResults) =>
            result.features.map(
                ({ geometry, properties: { id, locality, name } }) => ({
                    value: id,
                    label: locality ? `${name}, ${locality}` : name,
                    coordinates: {
                        longitude: geometry.coordinates[0],
                        latitude: geometry.coordinates[1],
                    },
                }),
            ),
        )
}

export type { AutocompleteItem }
export { fetchAutocomplete }
