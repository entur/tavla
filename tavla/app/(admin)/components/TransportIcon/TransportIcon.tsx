import { transportModeNames } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/utils'
import type {
    TTransportMode,
    TTransportSubmode,
} from 'src/types/graphql-schema'
import { getTransportIcon, sizeClasses } from './utils'

export default function TransportIcon({
    transportMode,
    transportSubmode,
    className,
    size = 7,
    background = false,
    whiteIcon = false,
}: {
    transportMode: TTransportMode | null
    transportSubmode?: TTransportSubmode
    className?: string
    size?: 4 | 6 | 7
    background?: boolean
    whiteIcon?: boolean
}) {
    const mode = transportMode ?? 'unknown'
    const sizeString = sizeClasses[size]

    const Component = getTransportIcon(mode, transportSubmode)
    const altText =
        mode === 'unknown'
            ? 'Ukjent transportmiddel'
            : `${transportModeNames(mode)}`
    return (
        <Component
            className={`${sizeString} ${background ? `bg-${mode} p-1 rounded-md` : ''} ${whiteIcon ? 'text-white' : ''} ${className ?? ''}`}
            role="img"
            aria-label={altText}
        />
    )
}
