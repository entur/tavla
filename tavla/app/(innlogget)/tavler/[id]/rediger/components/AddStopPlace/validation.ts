import { z } from 'zod'

export const closestStopPlacesSchema = z
    .array(
        z.object({
            id: z.string().trim().min(1, 'Du må velge et stoppested'),
            name: z.string().trim().min(1, 'Du må velge et stoppested'),
            county: z.string().trim().optional(),
        }),
    )
    .min(1, 'Du må velge minst ett stoppested')

export function parseClosestStopPlaces(
    data: FormData,
): z.ZodSafeParseResult<z.infer<typeof closestStopPlacesSchema>> {
    let raw: unknown
    try {
        raw = JSON.parse((data.get('closest_stop_places') as string) || '[]')
    } catch {
        raw = []
    }
    return closestStopPlacesSchema.safeParse(raw)
}
