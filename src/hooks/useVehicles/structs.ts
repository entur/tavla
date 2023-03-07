import { array, number, string, type } from 'superstruct'

const VehicleStruct = type({
    id: string(),
    lat: number(),
    lon: number(),
    system: type({
        operator: type({
            id: string(),
            name: type({
                translation: array(
                    type({
                        language: string(),
                        value: string(),
                    }),
                ),
            }),
        }),
    }),
})

export { VehicleStruct }
