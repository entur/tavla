import React, { useMemo } from 'react'
import { EmptyStopTile } from 'components/EmptyStopTile/EmptyStopTile'
import { ErrorTile } from 'components/ErrorTile/ErrorTile'
import { Loader } from 'components/Loader/Loader'
import { Tile } from 'components/Tile/Tile'
import {
    byDepartureTime,
    filterHidden,
    toDeparture,
} from 'logic/use-stop-place-with-estimated-calls/departure'
import { useStopPlaceWithEstimatedCalls } from 'logic/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import { useSettings } from 'settings/SettingsProvider'
import { ResponsiveTable } from './ResponsiveTable/ResponsiveTable'
import classes from './ResponsiveDepartureTile.module.scss'

const ResponsiveDepartureTile: React.FC<{ stopPlaceId: string }> = ({
    stopPlaceId,
}) => {
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
                .filter(filterHidden(stopPlaceId, settings))
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
