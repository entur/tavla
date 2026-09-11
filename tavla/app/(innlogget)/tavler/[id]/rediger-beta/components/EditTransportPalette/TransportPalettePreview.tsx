import { transportModeNames } from 'app/_components/TileCard/utils'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import type { BoardDB } from 'types/db-types/boards'
import type { TTransportMode, TTransportSubmode } from 'types/graphql-schema'
import { getTransportColorDescription } from '../utils/colorPalette'
import type { TransportPaletteValue } from './validation'

const busAndTrainModes: TTransportMode[] = ['bus', 'coach', 'rail']

const transportModes: { mode: TTransportMode; submode?: TTransportSubmode }[] =
    [
        { mode: 'air' },
        { mode: 'metro' },
        { mode: 'tram' },
        { mode: 'water', submode: 'internationalCarFerry' },
        { mode: 'water' },
    ]

function TransportPalettePreview({
    palette,
    theme,
    iconClassName,
}: {
    palette: { value: TransportPaletteValue; label: string }
    theme: BoardDB['theme']
    iconClassName: string
}) {
    return (
        <div
            className="flex max-w-max flex-col rounded-md bg-secondary px-3 py-3"
            data-theme={theme ?? 'dark'}
            data-transport-palette={palette.value}
        >
            <div className="grid grid-cols-8 gap-1.5">
                {busAndTrainModes.map((mode) => {
                    const colorDescription = getTransportColorDescription(
                        palette.value,
                        mode,
                    )
                    return (
                        <div
                            className="max-w-min"
                            key={mode}
                            aria-label={`${transportModeNames(mode)}${colorDescription ? `, ${colorDescription}` : ''}`}
                            role="img"
                        >
                            <TransportIcon
                                transportMode={mode}
                                background
                                className={iconClassName}
                            />
                        </div>
                    )
                })}
                {transportModes.map((mode) => {
                    const colorDescription = getTransportColorDescription(
                        palette.value,
                        mode.mode,
                    )
                    return (
                        <div
                            key={mode.submode ?? mode.mode}
                            role="img"
                            aria-label={`${transportModeNames(mode.mode)}${colorDescription ? `, ${colorDescription}` : ''}`}
                        >
                            <TransportIcon
                                transportMode={mode.mode}
                                transportSubmode={mode.submode}
                                background
                                className={iconClassName}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export { TransportPalettePreview }
