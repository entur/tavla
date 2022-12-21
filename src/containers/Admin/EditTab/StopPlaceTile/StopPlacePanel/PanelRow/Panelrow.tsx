import React, { ChangeEvent, useCallback, useMemo } from 'react'
import { uniq, uniqBy } from 'lodash'
import { Checkbox, TravelSwitch } from '@entur/form'
import type { TravelSwitchProps } from '@entur/form'
import { Paragraph } from '@entur/typography'
import { ExpandablePanel } from '@entur/expand'
import { isTransport } from '../../../../../../utils/typeguards'
import { TransportMode } from '../../../../../../../graphql-generated/journey-planner-v3'
import { useSettings } from '../../../../../../settings/SettingsProvider'
import { useStopPlaceWithEstimatedCalls } from '../../../../../../logic/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import { toDeparture } from '../../../../../../logic/use-stop-place-with-estimated-calls/departure'
import { toggleValueInList } from '../../../../../../utils/array'
import { Loader } from '../../../../../../components/Loader/Loader'

interface Props {
    stopPlaceId: string
}

const PanelRow = ({ stopPlaceId }: Props): JSX.Element => {
    const [settings, setSettings] = useSettings()

    const { stopPlaceWithEstimatedCalls, loading } =
        useStopPlaceWithEstimatedCalls({
            stopPlaceId,
            timeRange: 604800,
            numberOfDeparturesPerLineAndDestinationDisplay: 1,
        })

    const departures = useMemo(
        () =>
            stopPlaceWithEstimatedCalls?.estimatedCalls.map(toDeparture) ?? [],
        [stopPlaceWithEstimatedCalls?.estimatedCalls],
    )

    const filteredDepartures = useMemo(
        () =>
            departures.filter(
                (departure) =>
                    !settings.hiddenStopModes[stopPlaceId]?.includes(
                        departure.transportMode,
                    ),
            ),
        [departures, settings, stopPlaceId],
    )

    const uniqueDepartures = useMemo(
        () => uniqBy(filteredDepartures, 'route'),
        [filteredDepartures],
    )

    const uniqueModes = useMemo(
        () => uniq(departures.map((it) => it.transportMode)),
        [departures],
    )

    const onToggleStop = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const checked = event.target.checked

            setSettings({
                hiddenStops: toggleValueInList(
                    settings.hiddenStops,
                    stopPlaceId,
                ),
                hiddenStopModes: {
                    ...settings.hiddenStopModes,
                    [stopPlaceId]: !checked ? uniqueModes : [],
                },
            })
        },
        [
            stopPlaceId,
            setSettings,
            settings.hiddenStops,
            settings.hiddenStopModes,
            uniqueModes,
        ],
    )

    const onToggleRoute = useCallback(
        (route: string) => {
            const newHiddenRoutes = {
                ...settings.hiddenRoutes,
                [stopPlaceId]: toggleValueInList(
                    settings.hiddenRoutes[stopPlaceId] || [],
                    route,
                ),
            }
            setSettings({
                hiddenRoutes: newHiddenRoutes,
            })
        },
        [settings.hiddenRoutes, stopPlaceId, setSettings],
    )

    const onToggleMode = useCallback(
        (mode: TransportMode): void => {
            const newHiddenModes = {
                ...settings.hiddenStopModes,
                [stopPlaceId]: toggleValueInList(
                    settings.hiddenStopModes[stopPlaceId] || [],
                    mode,
                ),
            }

            const allModesUnchecked =
                uniqueModes.length === newHiddenModes[stopPlaceId]?.length

            if (allModesUnchecked) {
                setSettings({
                    hiddenStops: [...settings.hiddenStops, stopPlaceId],
                    hiddenStopModes: newHiddenModes,
                })
                return
            }

            setSettings({
                hiddenStops: settings.hiddenStops.filter(
                    (id) => id !== stopPlaceId,
                ),
                hiddenStopModes: newHiddenModes,
            })
        },
        [
            settings.hiddenStopModes,
            settings.hiddenStops,
            stopPlaceId,
            uniqueModes.length,
            setSettings,
        ],
    )

    if (loading) {
        return (
            <div className="stop-place-panel__row">
                <Loader />
            </div>
        )
    }

    if (!stopPlaceWithEstimatedCalls) {
        return (
            <div className="stop-place-panel__row">
                <Paragraph>
                    Fant ikke informasjon om stoppestedet med id {stopPlaceId}
                </Paragraph>
            </div>
        )
    }

    const header = (
        <div className="stop-place-panel__row__header">
            <span className="admin__checkbox-and-stopplace">
                <span onClick={(event): void => event.stopPropagation()}>
                    <Checkbox
                        id={stopPlaceWithEstimatedCalls.id}
                        className="stop-place-panel__row__checkbox"
                        checked={
                            !settings.hiddenStops.includes(
                                stopPlaceWithEstimatedCalls.id,
                            )
                        }
                        onChange={onToggleStop}
                    />
                </span>
                <span>{stopPlaceWithEstimatedCalls.name}</span>
            </span>
            <span
                className="admin__travel-switch"
                onClick={(event): void => event.stopPropagation()}
            >
                {uniqueModes.map((mode) => {
                    const props: Partial<TravelSwitchProps> = {
                        size: 'large',
                        onChange: (): void => onToggleMode(mode),
                        checked:
                            !settings.hiddenStopModes[
                                stopPlaceWithEstimatedCalls.id
                            ]?.includes(mode),
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

    if (!departures.length) {
        return (
            <div
                key={stopPlaceWithEstimatedCalls.id}
                className="stop-place-panel__row stop-place-panel__row__empty"
            >
                {header}
            </div>
        )
    }

    return (
        <div
            key={stopPlaceWithEstimatedCalls.id}
            className="stop-place-panel__row"
        >
            <ExpandablePanel
                className="stop-place-panel__row__expandable"
                title={header}
            >
                <div className="stop-place-panel__row__content">
                    {uniqueDepartures.map(({ route }) => {
                        const routeId = `${stopPlaceWithEstimatedCalls.id}-${route}`

                        return (
                            <Checkbox
                                key={`checkbox-${routeId}`}
                                className="stop-place-panel__route"
                                name={route}
                                onChange={() => onToggleRoute(route)}
                                checked={
                                    !settings.hiddenRoutes[
                                        stopPlaceWithEstimatedCalls.id
                                    ]?.includes(route)
                                }
                            >
                                {route}
                            </Checkbox>
                        )
                    })}
                </div>
            </ExpandablePanel>
        </div>
    )
}

export { PanelRow }
