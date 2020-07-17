import React, { useCallback, useMemo, useEffect, useState } from 'react'

import { ExpandablePanel } from '@entur/expand'
import { Checkbox, TravelSwitch, TravelSwitchProps } from '@entur/form'

import {
    getIcon,
    toggleValueInList,
    getIconColorType,
    unique,
} from '../../../../utils'
import { StopPlaceWithLines, IconColorType, Theme } from '../../../../types'
import { useSettingsContext } from '../../../../settings'

import './styles.scss'
import ThemeContrastWrapper from '../../../ThemeWrapper/ThemeContrastWrapper'
import { LegMode } from '@entur/sdk'
import { Paragraph } from '@entur/typography'

function StopPlacePanel(props: Props): JSX.Element {
    const [iconColorType, setIconColorType] = useState<IconColorType>(
        'contrast',
    )

    const [
        settings,
        { setHiddenStops, setHiddenRoutes, setHiddenStopModes },
    ] = useSettingsContext()

    const { hiddenStopModes, hiddenStops, hiddenRoutes } = settings

    const { stops } = props

    useEffect(() => {
        if (settings) {
            setIconColorType(getIconColorType(settings.theme))
        }
    }, [settings])

    const filteredStopPlaces = useMemo(
        () => stops.filter(({ lines }) => lines.length),
        [stops],
    )

    const onChooseAllPressed = useCallback(() => {
        if (hiddenStops.length > 0) {
            setHiddenStops([])
        } else {
            setHiddenStops(stops.map(({ id }) => id))
        }
    }, [hiddenStops.length, setHiddenStops, stops])

    const onToggleStop = useCallback(
        (event) => {
            const stopId = event.target.id
            const newDisabledList = toggleValueInList(hiddenStops, stopId)
            setHiddenStops(newDisabledList)
        },
        [hiddenStops, setHiddenStops],
    )

    const onToggleRoute = useCallback(
        (stopPlaceId: string, routeName: string) => {
            const newHiddenRoutes = {
                ...hiddenRoutes,
                [stopPlaceId]: toggleValueInList(
                    hiddenRoutes[stopPlaceId] || [],
                    routeName,
                ),
            }
            setHiddenRoutes(newHiddenRoutes)
        },
        [hiddenRoutes, setHiddenRoutes],
    )

    const isRouteSelected = useCallback(
        (stopPlaceId, routeName) => {
            return (
                !hiddenRoutes[stopPlaceId] ||
                !hiddenRoutes[stopPlaceId].includes(routeName)
            )
        },
        [hiddenRoutes],
    )

    const onToggleMode = useCallback(
        (stopPlaceId: string, mode: LegMode): void => {
            setHiddenStopModes({
                ...hiddenStopModes,
                [stopPlaceId]: toggleValueInList(
                    hiddenStopModes[stopPlaceId] || [],
                    mode,
                ),
            })
        },
        [setHiddenStopModes, hiddenStopModes],
    )

    if (!filteredStopPlaces.length) {
        return (
            <div className="stop-place-panel">
                <Paragraph>Det er ingen stoppesteder i nærheten.</Paragraph>
            </div>
        )
    }

    const useContrast = [Theme.DEFAULT, Theme.DARK].includes(settings?.theme)

    return (
        <ThemeContrastWrapper useContrast={useContrast}>
            <div className="stop-place-panel">
                <div className="stop-place-panel__header">
                    <div
                        className="stop-place-panel__checkall"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <Checkbox
                            id="check-all-stop-places"
                            name="check-all-stop-places"
                            onChange={onChooseAllPressed}
                            checked={!hiddenStops.length}
                        >
                            Velg alle
                        </Checkbox>
                    </div>
                </div>
                {filteredStopPlaces.map(({ name, id, lines }) => {
                    return (
                        <div key={id} className="stop-place-panel__row">
                            <ExpandablePanel
                                className="stop-place-panel__row__expandable"
                                title={
                                    <div className="stop-place-panel__row__header">
                                        <Checkbox
                                            id={id}
                                            className="stop-place-panel__row__checkbox"
                                            checked={!hiddenStops.includes(id)}
                                            onChange={onToggleStop}
                                        />
                                        <span>{name}</span>
                                        <span
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        >
                                            {unique(
                                                lines.map(
                                                    ({ transportMode }) =>
                                                        transportMode,
                                                ),
                                            ).map((mode) => (
                                                <TravelSwitch
                                                    key={mode}
                                                    transport={
                                                        mode as TravelSwitchProps['transport']
                                                    }
                                                    size="large"
                                                    onChange={(): void => {
                                                        onToggleMode(id, mode)
                                                    }}
                                                    checked={
                                                        !hiddenStopModes[
                                                            id
                                                        ]?.includes(mode)
                                                    }
                                                />
                                            ))}
                                        </span>
                                    </div>
                                }
                            >
                                <div className="stop-place-panel__row__content">
                                    {lines
                                        .filter(
                                            (line) =>
                                                !hiddenStopModes[id]?.includes(
                                                    line.transportMode,
                                                ),
                                        )
                                        .map(
                                            ({
                                                name: routeName,
                                                transportMode,
                                                transportSubmode,
                                            }) => {
                                                const routeId = `${id}-${routeName}`
                                                const icon = getIcon(
                                                    transportMode,
                                                    iconColorType,
                                                    transportSubmode,
                                                )

                                                return (
                                                    <Checkbox
                                                        key={`checkbox-${routeId}`}
                                                        id={`checkbox-${routeId}`}
                                                        className="stop-place-panel__route"
                                                        name={routeName}
                                                        onChange={(): void =>
                                                            onToggleRoute(
                                                                id,
                                                                routeName,
                                                            )
                                                        }
                                                        checked={isRouteSelected(
                                                            id,
                                                            routeName,
                                                        )}
                                                    >
                                                        {icon}
                                                        {routeName}
                                                    </Checkbox>
                                                )
                                            },
                                        )}
                                </div>
                            </ExpandablePanel>
                        </div>
                    )
                })}
            </div>
        </ThemeContrastWrapper>
    )
}

interface Props {
    stops: StopPlaceWithLines[]
}

export default StopPlacePanel
