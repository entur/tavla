import { array, Infer, is, number, string, type } from 'superstruct'

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

type Vehicle = Infer<typeof VehicleStruct>

const toVehicle = (obj: unknown) => (is(obj, VehicleStruct) ? obj : null)

export { toVehicle }
export type { Vehicle }
