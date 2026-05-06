import { Tooltip } from '@entur/tooltip'
import { transportModeNames } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/utils'
import type {
    TTransportMode,
    TTransportSubmode,
} from 'src/types/graphql-schema'
import {
    getColorMode,
    getTransportIcon,
    getTransportModeString,
    sizeClasses,
} from './utils'

const ConditionalTooltip = ({
    includeTooltip,
    tooltipString,
    children,
}: {
    includeTooltip: boolean
    tooltipString: string | undefined
    children: React.ReactElement
}) =>
    includeTooltip ? (
        <Tooltip
            content={tooltipString}
            placement="bottom"
            id={`tooltip-transport-${tooltipString}`}
        >
            {children}
        </Tooltip>
    ) : (
        children
    )

export default function TransportIcon({
    transportMode,
    transportSubmode,
    className,
    size = 7,
    background = false,
    whiteIcon = false,
    includeTooltip = false,
}: {
    transportMode: TTransportMode | null
    transportSubmode?: TTransportSubmode
    className?: string
    size?: 4 | 6 | 7
    background?: boolean
    whiteIcon?: boolean
    includeTooltip?: boolean
}) {
    const mode = transportMode ?? 'unknown'
    const sizeString = sizeClasses[size]

    const Component = getTransportIcon(mode, transportSubmode)
    const altText =
        mode === 'unknown'
            ? 'Ukjent transportmiddel'
            : `${transportModeNames(mode)}`

    const iconColor = getColorMode(mode, transportSubmode)

    return (
        <ConditionalTooltip
            includeTooltip={includeTooltip}
            tooltipString={getTransportModeString({
                mainMode: transportMode ?? '',
                subMode: transportSubmode ?? '',
            })}
        >
            <Component
                className={`${sizeString} ${background ? `bg-${iconColor} p-1 rounded-md` : ''} ${whiteIcon ? 'text-white' : ''} ${className ?? ''}`}
                role="img"
                aria-label={altText}
            />
        </ConditionalTooltip>
    )
}
