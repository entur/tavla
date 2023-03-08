import { array, number, string, type } from 'superstruct'

const RentalStationStruct = type({
    id: string(),
    name: type({
        translation: array(
            type({
                language: string(),
                value: string(),
            }),
        ),
    }),
    lat: number(),
    lon: number(),
    numBikesAvailable: number(),
    numDocksAvailable: number(),
})

export { RentalStationStruct }
