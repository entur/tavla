import type { TTransportSubmode } from 'types/graphql-schema'

export function getRelevantSubmode(
    submode?: TTransportSubmode | null,
): TTransportSubmode | undefined {
    if (submode?.startsWith('airport')) return submode
    if (submode === 'railReplacementBus') return submode
    if (submode?.includes('CarFerry')) return submode
    return undefined
}
