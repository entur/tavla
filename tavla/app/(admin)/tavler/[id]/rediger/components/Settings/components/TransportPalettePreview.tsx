import type { BoardTheme, TransportPalette } from 'src/types/db-types/boards'
import type {
    TTransportMode,
    TTransportSubmode,
} from 'src/types/graphql-schema'
import { transportModeNames } from '../../TileCard/utils'
import { getTransportColorDescription } from '../colorPalettes'
import { TransportIcon } from './TransportIcon'

const busAndTrainModes: { mode: TTransportMode }[] = [
    {
        mode: 'bus',
    },
    {
        mode: 'rail',
    },
]

const transportModes: { mode: TTransportMode; submode?: TTransportSubmode }[] =
    [
        {
            mode: 'water',
            submode: 'internationalCarFerry',
        },
        {
            mode: 'air',
        },
        {
            mode: 'water',
        },
        {
            mode: 'metro',
        },
        {
            mode: 'taxi',
        },
        {
            mode: 'tram',
        },
    ]

function TransportPalettePreview({
    theme,
    palette,
}: {
    theme: BoardTheme
    palette: TransportPalette
}) {
    return (
        <div
            className="flex max-w-max flex-col rounded-md bg-secondary px-3 py-3"
            data-theme={theme}
            data-transport-palette={palette}
        >
            <div className="grid grid-cols-4 gap-1.5">
                {busAndTrainModes.map((mode) => {
                    const colorDescription = getTransportColorDescription(
                        palette,
                        mode.mode,
                    )
                    return (
                        <div
                            className="max-w-min"
                            key={theme + mode.mode}
                            aria-label={`${transportModeNames(mode.mode)}${colorDescription ? `, ${colorDescription}` : ''}`}
                            role="img"
                        >
                            <TransportIcon
                                key={mode.mode}
                                transportMode={mode.mode}
                                className={`h-7 w-7 rounded-md bg-${mode.mode} p-1 text-background`}
                            />
                        </div>
                    )
                })}
                {transportModes.map((mode) => {
                    const colorDescription = getTransportColorDescription(
                        palette,
                        mode.mode,
                    )
                    return (
                        <div
                            key={theme + (mode.submode ?? mode.mode)}
                            role="img"
                            aria-label={`${transportModeNames(mode.mode ?? mode.mode)}${colorDescription ? `, ${colorDescription}` : ''}`}
                        >
                            <TransportIcon
                                key={mode.mode}
                                transportMode={mode.mode}
                                className={`h-7 w-7 rounded-md bg-${mode.mode} p-1 text-background`}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export { TransportPalettePreview }
