import { array, Infer, is, number, string, type } from 'superstruct'

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

type RentalStation = Infer<typeof RentalStationStruct>

const isRentalStation = (obj: unknown): RentalStation | null =>
    is(obj, RentalStationStruct) ? obj : null

export { isRentalStation }
export type { RentalStation }
