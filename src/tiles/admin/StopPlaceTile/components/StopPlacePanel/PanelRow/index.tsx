import React, { ChangeEvent, useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import { uniq, uniqBy, xor } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { useStopPlaceWithEstimatedCalls } from 'hooks/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import { toDeparture } from 'hooks/use-stop-place-with-estimated-calls/departure'
import { Loader } from 'components/Loader/Loader'
import { ExpandablePanel } from '@entur/expand'
import { Paragraph } from '@entur/typography'
import { Checkbox } from '@entur/form'
import { CloseSmallIcon } from '@entur/icons'
import { IconButton } from '@entur/button'
import { RouteCheckbox } from './RouteCheckbox'
import { TransportModeSwitch } from './TransportModeSwitch'
import classes from './PanelRow.module.scss'

function PanelRow({ stopPlaceId }: { stopPlaceId: string }) {
    const [closeRow] = useState(false)
    const [settings, setSettings] = useSettings()
    const [removeStopPlace, setRemoveStopPlace] = useState(false)

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
            <div className={classes.PanelRow}>
                <Loader />
            </div>
        )
    }

    if (!stopPlaceWithEstimatedCalls) {
        return (
            <div className={classes.PanelRow}>
                <Paragraph>
                    Fant ikke informasjon om stoppestedet med id {stopPlaceId}
                </Paragraph>
            </div>
        )
    }

    function handleRemoveStopPlace() {
        setRemoveStopPlace(true)
        const hiddenStopPlaceList = [...settings.hiddenStops, stopPlaceId]
        setSettings({ hiddenStops: hiddenStopPlaceList })
    }

    const header = (
        <div className={classes.Header}>
            <span onClick={(event): void => event.stopPropagation()}>
                <Checkbox
                    id={stopPlaceWithEstimatedCalls.id}
                    checked={
                        !settings.hiddenStops.includes(
                            stopPlaceWithEstimatedCalls.id,
                        )
                    }
                    onChange={onToggleStop}
                />
            </span>
            <span className={classes.HeaderText}>
                {stopPlaceWithEstimatedCalls.name}
            </span>
            <span
                className={classes.TravelSwitch}
                onClick={(event): void => event.stopPropagation()}
            >
                {uniqueModes.map((mode) => (
                    <TransportModeSwitch
                        className={classes.TransportModeSwitch}
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
            <div className={classNames(classes.PanelRow, classes.Empty)}>
                {header}
            </div>
        )
    }

    console.log('dette er settings hiden:' + settings.hiddenStops)
    console.log('dette er hidemode i state i koden: ' + removeStopPlace)
    return (
        <>
            {!removeStopPlace && (
                <div className={classes.PanelRow}>
                    <ExpandablePanel
                        className={classes.Expandable}
                        title={header}
                    >
                        <div className={classes.Content}>
                            {!closeRow &&
                                uniqueDepartures.map(({ route }) => (
                                    <>
                                        <RouteCheckbox
                                            key={route}
                                            route={route}
                                            stopPlaceId={
                                                stopPlaceWithEstimatedCalls?.id
                                            }
                                        />
                                    </>
                                ))}
                        </div>
                    </ExpandablePanel>
                    <IconButton onClick={() => handleRemoveStopPlace()}>
                        <CloseSmallIcon key={stopPlaceId} />
                    </IconButton>
                </div>
            )}
        </>
    )
}

export { PanelRow }
