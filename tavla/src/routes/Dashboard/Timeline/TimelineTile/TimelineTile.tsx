import React, { Fragment, useMemo } from 'react'
import { Tile } from 'components/Tile'
import { TileHeader } from 'components/TileHeader'
import { Loader } from 'components/Loader'
import { WalkTrip } from 'components/WalkTrip'
import { groupBy } from 'lodash'
import { getIconColorType, getTransportHeaderIcons } from 'utils/icon'
import { useSettings } from 'settings/SettingsProvider'
import { useStopPlaceWithEstimatedCalls } from 'hooks/useStopPlaceWithEstimatedCalls'
import { Mode } from 'graphql-generated/journey-planner-v3'
import { Departure } from 'src/types'
import { ErrorTile } from 'tiles/dashboard/ErrorTile'
import { filterHiddenRoutes, toDeparture } from 'utils/utils'
import { Tick } from '../Tick/Tick'
import { TICKS } from '../utils'
import { TimelineWalkMarker } from '../TimelineWalkMarker/TimelineWalkMarker'
import { TimelineDeparture } from '../TimelineDeparture/TimelineDeparture'
import classes from './TimelineTile.module.scss'

const MODE_ORDER = ['rail', 'metro', 'tram', 'bus', 'water', 'air']

function orderDepartures(a: Departure, b: Departure): number {
    return (
        MODE_ORDER.indexOf(a.transportMode) -
        MODE_ORDER.indexOf(b.transportMode)
    )
}

function TimelineTile({ stopPlaceId }: { stopPlaceId: string }) {
    const [settings] = useSettings()
    const iconColorType = useMemo(
        () => getIconColorType(settings.theme),
        [settings.theme],
    )

    const { stopPlaceWithEstimatedCalls, loading } =
        useStopPlaceWithEstimatedCalls({
            stopPlaceId,
            hiddenStopModes: settings.hiddenStopModes,
        })

    const departures = useMemo(
        () =>
            stopPlaceWithEstimatedCalls?.estimatedCalls
                .map(toDeparture)
                .filter(filterHiddenRoutes(stopPlaceId, settings)) ?? [],
        [stopPlaceWithEstimatedCalls?.estimatedCalls, stopPlaceId, settings],
    )

    const groupedDepartures = useMemo(
        () => groupBy(departures.sort(orderDepartures), 'transportMode'),
        [departures],
    )

    if (loading) {
        return (
            <Tile className={classes.TimelineTile}>
                <Loader />
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
            <WalkTrip
                coordinates={coordinates}
                hideWalkInfo={settings.hideWalkInfo}
            />
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
