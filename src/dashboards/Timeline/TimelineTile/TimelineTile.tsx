import React, { Fragment, useMemo } from 'react'
import { groupBy } from 'lodash'
import { Loader } from '@entur/loader'
import { getIconColorType, getTransportHeaderIcons } from '../../../utils/icon'
import { useSettings } from '../../../settings/SettingsProvider'
import { Tick } from '../Tick/Tick'
import { useStopPlaceWithEstimatedCalls } from '../../../logic/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import { Tile } from '../../../components/Tile/Tile'
import { TileHeader } from '../../../components/TileHeader/TileHeader'
import { WalkTrip } from '../../../components/WalkTrip/WalkTrip'
import {
    Departure,
    filterHidden,
    toDeparture,
} from '../../../logic/use-stop-place-with-estimated-calls/departure'
import { TICKS } from '../utils'
import { TimelineWalkMarker } from '../TimelineWalkMarker/TimelineWalkMarker'
import { Mode } from '../../../../graphql-generated/journey-planner-v3'
import { TimelineDeparture } from '../TimelineDeparture/TimelineDeparture'
import { ErrorTile } from '../../../components/ErrorTile/ErrorTile'
import classes from './TimelineTile.module.scss'

const MODE_ORDER = ['rail', 'metro', 'tram', 'bus', 'water', 'air']

function orderDepartures(a: Departure, b: Departure): number {
    return (
        MODE_ORDER.indexOf(a.transportMode) -
        MODE_ORDER.indexOf(b.transportMode)
    )
}

interface Props {
    stopPlaceId: string
}

const TimelineTile: React.FC<Props> = ({ stopPlaceId }) => {
    const [settings] = useSettings()
    const iconColorType = useMemo(
        () => getIconColorType(settings.theme),
        [settings.theme],
    )

    const { stopPlaceWithEstimatedCalls, loading } =
        useStopPlaceWithEstimatedCalls({ stopPlaceId })

    const departures = useMemo(
        () =>
            stopPlaceWithEstimatedCalls?.estimatedCalls
                .map(toDeparture)
                .filter(filterHidden(stopPlaceId, settings)) ?? [],
        [stopPlaceWithEstimatedCalls?.estimatedCalls, stopPlaceId, settings],
    )

    const groupedDepartures = useMemo(
        () => groupBy(departures.sort(orderDepartures), 'transportMode'),
        [departures],
    )

    if (loading) {
        return (
            <Tile className={classes.TimelineTile}>
                <Loader>Laster</Loader>
            </Tile>
        )
    }

    if (!stopPlaceWithEstimatedCalls) {
        return <ErrorTile className={classes.TimelineTile} />
    }

    const coordinates = {
        latitude: stopPlaceWithEstimatedCalls.latitude,
        longitude: stopPlaceWithEstimatedCalls.longitude,
    }

    return (
        <Tile className={classes.TimelineTile}>
            <TileHeader
                title={stopPlaceWithEstimatedCalls.name}
                icons={getTransportHeaderIcons(departures, iconColorType)}
            />
            <WalkTrip coordinates={coordinates} />
            <TimelineWalkMarker coordinates={coordinates} />
            {Object.entries(groupedDepartures).map(([mode, lines]) => (
                <Fragment key={mode}>
                    <div className={classes.Track}>
                        {lines.map((departure) => (
                            <TimelineDeparture
                                key={departure.id}
                                departure={departure}
                                iconColorType={iconColorType}
                            />
                        ))}
                    </div>
                    <div className={classes.Line}>
                        {[...TICKS].reverse().map((minutes, index) => (
                            <Tick
                                key={minutes}
                                mode={mode as Mode}
                                minutes={minutes}
                                index={index}
                            />
                        ))}
                    </div>
                </Fragment>
            ))}
        </Tile>
    )
}

export { TimelineTile }
