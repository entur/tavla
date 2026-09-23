import type { QuayWithFrontText } from 'app/_components/TileCard/types'
import type { TTransportMode } from 'src/types/graphql-schema'

/** Vanligste transportmiddel på en quay — brukes til å velge «Spor» vs «Plattform». */
export function quayPrimaryMode(
    quay: QuayWithFrontText,
): TTransportMode | undefined {
    const counts = new Map<TTransportMode, number>()
    for (const line of quay.lines) {
        const mode = line.transportMode as TTransportMode | undefined
        if (mode && mode !== 'unknown') {
            counts.set(mode, (counts.get(mode) ?? 0) + 1)
        }
    }
    let best: TTransportMode | undefined
    let bestCount = 0
    for (const [mode, count] of counts) {
        if (count > bestCount) {
            best = mode
            bestCount = count
        }
    }
    return best
}

function platformLabel(quay: QuayWithFrontText): string {
    const mode = quayPrimaryMode(quay)
    return mode === 'metro' || mode === 'rail' ? 'Spor' : 'Plattform'
}

/** Full tittel, f.eks. «Plattform B» / «Spor 10». */
export function quayTitle(quay: QuayWithFrontText): string {
    if (quay.publicCode) {
        return `${platformLabel(quay)} ${quay.publicCode}`
    }
    return quay.name || 'Ukjent plattform'
}

/** Kort etikett til plattform-tagger i linje-linsen, f.eks. «Pl. B» / «Spor 10». */
export function quayTag(quay: QuayWithFrontText): string {
    if (!quay.publicCode) return quay.name || 'Ukjent'
    const label = platformLabel(quay)
    return label === 'Spor'
        ? `Spor ${quay.publicCode}`
        : `Pl. ${quay.publicCode}`
}
