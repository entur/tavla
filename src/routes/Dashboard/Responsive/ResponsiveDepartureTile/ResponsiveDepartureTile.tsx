import React, { useMemo } from 'react'
import { Loader } from 'components/Loader'
import { Tile } from 'components/Tile'
import { useStopPlaceWithEstimatedCalls } from 'hooks/useStopPlaceWithEstimatedCalls'
import { useSettings } from 'settings/SettingsProvider'
import { ErrorTile } from 'tiles/dashboard/ErrorTile'
import { EmptyStopTile } from 'tiles/dashboard/EmptyStopTile'
import { byDepartureTime, filterHiddenRoutes, toDeparture } from 'utils/utils'
import { ResponsiveTable } from './ResponsiveTable/ResponsiveTable'
import classes from './ResponsiveDepartureTile.module.scss'

function ResponsiveDepartureTile({ stopPlaceId }: { stopPlaceId: string }) {
    const [settings] = useSettings()

    const { stopPlaceWithEstimatedCalls, loading } =
        useStopPlaceWithEstimatedCalls({
            stopPlaceId,
            numberOfDeparturesPerLineAndDestinationDisplay: 20,
            hiddenStopModes: settings.hiddenStopModes,
        })

    const departures = useMemo(
        () =>
            stopPlaceWithEstimatedCalls?.estimatedCalls
                .map(toDeparture)
                .filter(filterHiddenRoutes(stopPlaceId, settings))
                .sort(byDepartureTime) ?? [],
        [stopPlaceWithEstimatedCalls?.estimatedCalls, stopPlaceId, settings],
    )

    if (loading) {
        return <Loader />
    }

    if (!stopPlaceWithEstimatedCalls) {
        return <ErrorTile />
    }

    if (!departures.length) {
        return <EmptyStopTile title={stopPlaceWithEstimatedCalls.name} />
    }

    return (
        <Tile>
            <div className={classes.ResponsiveTile}>
                <h2 className={classes.Heading}>
                    {stopPlaceWithEstimatedCalls.name}
                </h2>
                <ResponsiveTable departures={departures} />
            </div>
        </Tile>
    )
}

export { ResponsiveDepartureTile }
