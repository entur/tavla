import { array, Infer, is, number, string, type } from 'superstruct'
import { getTranslation } from '../../utils/utils'

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

const toRentalStation = (obj: unknown): RentalStation | null =>
    is(obj, RentalStationStruct) ? obj : null

const byName = (a: RentalStation, b: RentalStation): number => {
    const aName = getTranslation(a.name)
    const bName = getTranslation(b.name)
    if (!aName) return 1
    if (!bName) return -1
    return aName.localeCompare(bName, 'no')
}

export { toRentalStation, byName }
export type { RentalStation }
