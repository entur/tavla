import { TransportIcon } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/TransportIcon'
import { isOnlyWhiteSpace } from 'app/(admin)/tavler/[id]/utils'
import type {
    TTransportMode,
    TTransportSubmode,
} from 'src/types/graphql-schema'

export const transportModeNames: Record<TTransportMode, string> = {
    air: 'Fly',
    bus: 'Buss',
    cableway: 'Taubane',
    water: 'Båt',
    funicular: 'Kabelbane',
    lift: 'Heis',
    rail: 'Tog',
    metro: 'T-bane',
    tram: 'Trikk',
    trolleybus: 'Trolley-buss',
    monorail: 'Énskinnebane',
    coach: 'Langdistansebuss',
    taxi: 'Taxi',
    unknown: 'Ukjent',
}

type ColorMode = TTransportMode | 'regional-bus'

function getColorMode(
    transportMode: TTransportMode,
    transportSubmode?: TTransportSubmode,
): ColorMode {
    if (transportSubmode?.startsWith('airport')) return 'air'
    if (transportSubmode === 'railReplacementBus') return 'rail'
    if (transportSubmode === 'regionalBus') return 'regional-bus'
    return transportMode
}

function SmallTravelTag({
    transportMode,
    publicCode,
    icons = true,
}: {
    transportMode?: TTransportMode | null
    publicCode?: string | null
    icons?: boolean
}) {
    if (!transportMode) return null
    return (
        <div
            role="img"
            aria-label={`${transportModeNames[transportMode]} - linje ${publicCode}`}
            className={`mx-[2px] flex h-5 items-center justify-between rounded-sm p-1 font-bold text-background bg-${transportMode}`}
            key={`${transportMode}${publicCode}`}
            data-transport-palette="default"
        >
            {icons && (
                <TransportIcon
                    className={`h-6 fill-background ${
                        publicCode && !isOnlyWhiteSpace(publicCode)
                            ? 'w-6 max-sm:hidden sm:block lg:hidden xl:block'
                            : 'block w-4'
                    }`}
                    transportMode={transportMode}
                />
            )}
            {publicCode && !isOnlyWhiteSpace(publicCode) && (
                <div className="align-center flex w-full justify-center text-[0.65rem]">
                    {publicCode}
                </div>
            )}
        </div>
    )
}

export { SmallTravelTag }
