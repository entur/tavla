import React, { ChangeEvent } from 'react'
import { Checkbox, TravelSwitch } from '@entur/form'
import type { TravelSwitchProps } from '@entur/form'
import { ExpandablePanel } from '@entur/expand'
import { TransportMode } from '@entur/sdk'
import { unique, isTransport } from '../../../../../utils'
import { Settings } from '../../../../../settings'
import { StopPlaceWithLines } from '../../../../../types'

const PanelRow = ({
    onToggleStop,
    onToggleMode,
    onToggleRoute,
    settings,
    stopPlace,
}: Props): JSX.Element => {
    const { id, lines, name } = stopPlace

    const visibleLines = lines.filter(
        (line) =>
            !settings.hiddenStopModes[id]?.includes(
                line.transportMode as unknown as TransportMode,
            ),
    )

    const uniqueModes = unique(lines.map(({ transportMode }) => transportMode))

    const header = (
        <div className="stop-place-panel__row__header">
            <span className="admin__checkbox-and-stopplace">
                <span onClick={(event): void => event.stopPropagation()}>
                    <Checkbox
                        id={id}
                        className="stop-place-panel__row__checkbox"
                        checked={!settings.hiddenStops.includes(id)}
                        onChange={onToggleStop}
                    />
                </span>
                <span>{name}</span>
            </span>
            <span
                className="admin__travel-switch"
                onClick={(event): void => event.stopPropagation()}
            >
                {uniqueModes.map((mode) => {
                    const props: Partial<TravelSwitchProps> = {
                        size: 'large',
                        onChange: (): void =>
                            onToggleMode(id, mode as unknown as TransportMode),
                        checked: !settings.hiddenStopModes[id]?.includes(
                            mode as unknown as TransportMode,
                        ),
                    }

                    if (isTransport(mode)) {
                        return (
                            <TravelSwitch
                                {...props}
                                transport={mode}
                                key={mode}
                            />
                        )
                    } else if (mode === 'coach') {
                        return (
                            <TravelSwitch {...props} transport="bus" key={mode}>
                                Coach
                            </TravelSwitch>
                        )
                    } else {
                        return null
                    }
                })}
            </span>
        </div>
    )

    if (!visibleLines.length) {
        return (
            <div
                key={id}
                className="stop-place-panel__row stop-place-panel__row__empty"
            >
                {header}
            </div>
        )
    }

    return (
        <div key={id} className="stop-place-panel__row">
            <ExpandablePanel
                className="stop-place-panel__row__expandable"
                title={header}
            >
                <div className="stop-place-panel__row__content">
                    {visibleLines.map(({ name: routeName }) => {
                        const routeId = `${id}-${routeName}`

                        return (
                            <Checkbox
                                key={`checkbox-${routeId}`}
                                className="stop-place-panel__route"
                                name={routeName}
                                onChange={(): void =>
                                    onToggleRoute(id, routeName)
                                }
                                checked={
                                    !settings.hiddenRoutes[id]?.includes(
                                        routeName,
                                    )
                                }
                            >
                                {routeName}
                            </Checkbox>
                        )
                    })}
                </div>
            </ExpandablePanel>
        </div>
    )
}

interface Props {
    onToggleMode: (id: string, mode: TransportMode) => void
    onToggleRoute: (id: string, routeName: string) => void
    onToggleStop: (event: ChangeEvent<HTMLInputElement>) => void
    stopPlace: StopPlaceWithLines
    settings: Settings
}

export { PanelRow }
