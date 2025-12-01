'use server'
import { isOnlyWhiteSpace } from 'app/(admin)/tavler/[id]/utils'
import { TTransportMode, TTransportSubmode } from 'types/graphql-schema'
import { TransportIcon } from './TransportIcon_Legacy'

const transportColors: Record<string, string> = {
    air: '#7E0664',
    bus: '#C5044E',
    cableway: '#78469A',
    water: '#0C6693',
    funicular: '#78469A',
    lift: '#78469A',
    rail: '#00367F',
    metro: '#BF5826',
    tram: '#78469A',
    trolleybus: '#C5044E',
    monorail: '#00367F',
    coach: '#33826B',
    taxi: '#3D3E40',
    unknown: '#666666',
}

const transportColorsTransparent: Record<string, string> = {
    air: 'rgba(126, 6, 100, 0.15)',
    bus: 'rgba(197, 4, 78, 0.15)',
    cableway: 'rgba(120, 70, 154, 0.15)',
    water: 'rgba(12, 102, 147, 0.15)',
    funicular: 'rgba(120, 70, 154, 0.15)',
    lift: 'rgba(120, 70, 154, 0.15)',
    rail: 'rgba(0, 54, 127, 0.15)',
    metro: 'rgba(191, 88, 38, 0.15)',
    tram: 'rgba(120, 70, 154, 0.15)',
    trolleybus: 'rgba(197, 4, 78, 0.15)',
    monorail: 'rgba(0, 54, 127, 0.15)',
    coach: 'rgba(51, 130, 107, 0.15)',
    taxi: 'rgba(61, 62, 64, 0.15)',
    unknown: 'rgba(102, 102, 102, 0.15)',
}

const transportModeNames: Record<TTransportMode, string> = {
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

export default function TravelTag({
    transportMode,
    publicCode,
    transportSubmode,
    cancelled,
}: {
    transportMode: TTransportMode
    publicCode: string
    transportSubmode?: TTransportSubmode
    cancelled?: boolean
}) {
    const colorMode = transportSubmode?.startsWith('airport')
        ? 'air'
        : transportMode

    const solidColor = transportColors[colorMode] || transportColors.unknown
    const transparentColor =
        transportColorsTransparent[colorMode] ||
        transportColorsTransparent.unknown

    const isTransparent = cancelled && transportMode !== 'unknown'
    const backgroundColor = isTransparent ? transparentColor : solidColor
    const textColor = isTransparent ? solidColor : '#FFFFFF'

    return (
        <div
            aria-label={`${transportModeNames[transportMode]} - linje ${publicCode}`}
            style={{
                display: 'flex',
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '0.125rem',
                paddingLeft: '0.5rem',
                backgroundColor,
            }}
        >
            <TransportIcon
                style={{
                    height: '2em',
                    width: '2em',
                    color: textColor,
                    fill: textColor,
                }}
                transportMode={transportMode}
                transportSubmode={transportSubmode}
            />
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    color: textColor,
                }}
            >
                {publicCode}
            </div>
        </div>
    )
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
            aria-label={`${transportModeNames[transportMode]} - linje ${publicCode}`}
            key={`${transportMode}${publicCode}`}
            data-transport-palette="default"
            style={{
                margin: '0 2px',
                display: 'flex',
                height: '1.25rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '0.125rem',
                padding: '0.25rem',
                fontWeight: 700,
                color: '#FFFFFF',
                backgroundColor:
                    transportColors[transportMode] || transportColors.unknown,
            }}
        >
            {icons && (
                <TransportIcon
                    style={{
                        height: '1.5rem',
                        fill: '#FFFFFF',
                        width:
                            publicCode && !isOnlyWhiteSpace(publicCode)
                                ? '1.5rem'
                                : '1rem',
                        display: 'block',
                    }}
                    transportMode={transportMode}
                />
            )}
            {publicCode && !isOnlyWhiteSpace(publicCode) && (
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '0.65rem',
                    }}
                >
                    {publicCode}
                </div>
            )}
        </div>
    )
}

export { SmallTravelTag, TravelTag }
