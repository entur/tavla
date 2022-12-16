import React, { ChangeEvent, useCallback, useMemo } from 'react'
import { uniq, uniqBy, xor } from 'lodash'
import { Checkbox } from '@entur/form'
import { Paragraph } from '@entur/typography'
import { Loader } from '@entur/loader'
import { ExpandablePanel } from '@entur/expand'
import { useSettings } from '../../../../../../settings/SettingsProvider'
import { useStopPlaceWithEstimatedCalls } from '../../../../../../logic/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import { toDeparture } from '../../../../../../logic/use-stop-place-with-estimated-calls/departure'
import { RouteCheckbox } from './RouteCheckbox'
import { TransportModeSwitch } from './TransportModeSwitch'

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
                hiddenStops: xor(settings.hiddenStops, [stopPlaceId]),
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

    if (loading) {
        return (
            <div className="stop-place-panel__row">
                <Loader>Laster...</Loader>
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
                {uniqueModes.map((mode) => (
                    <TransportModeSwitch
                        key={mode}
                        stopPlaceId={stopPlaceId}
                        mode={mode}
                        numberOfModes={uniqueModes.length}
                    />
                ))}
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
                    {uniqueDepartures.map(({ route }) => (
                        <RouteCheckbox
                            key={route}
                            route={route}
                            stopPlaceId={stopPlaceWithEstimatedCalls?.id}
                        />
                    ))}
                </div>
            </ExpandablePanel>
        </div>
    )
}

export { PanelRow }
