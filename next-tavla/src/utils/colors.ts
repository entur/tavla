import { TPresentation, TTransportMode } from '@/types/graphql/schema'

export type TColors = { backgroundColor: string; color: string }

const thirdPartyColors: Record<string, TColors> = {
    'RUT:Line:1': {
        backgroundColor: '#0073db',
        color: '#fff',
    },
    'RUT:Line:2': {
        backgroundColor: '#ec700c',
        color: '#fff',
    },
    'RUT:Line:3': {
        backgroundColor: '#a85fa5',
        color: '#fff',
    },
    'RUT:Line:4': {
        backgroundColor: '#004a98',
        color: '#fff',
    },
    'RUT:Line:5': {
        backgroundColor: '#32aa35',
        color: '#fff',
    },
}

export function getPresentation(
    presentation: TPresentation | null,
    id: string,
    transportMode: TTransportMode | null,
): TColors {
    const customBackgroundColor = thirdPartyColors[id]
    if (customBackgroundColor) return customBackgroundColor

    const presentationBackgroundColor = presentation?.colour
        ? `#${presentation.colour}`
        : null

    const defaultBackgroundColor = `var(--table-transport-${transportMode}-color)`

    const color = presentation?.textColour
        ? `#${presentation.textColour}`
        : 'var(--primary-background-color)'

    return {
        backgroundColor: presentationBackgroundColor ?? defaultBackgroundColor,
        color,
    }
}
