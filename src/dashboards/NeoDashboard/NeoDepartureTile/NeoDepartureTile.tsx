import React, { useMemo } from 'react'
import { EmptyStopTile } from '../../../components/EmptyStopTile/EmptyStopTile'
import { ErrorTile } from '../../../components/ErrorTile/ErrorTile'
import { Loader } from '../../../components/Loader/Loader'
import { Tile } from '../../../components/Tile/Tile'
import {
    byDepartureTime,
    filterHidden,
    toDeparture,
} from '../../../logic/use-stop-place-with-estimated-calls/departure'
import { useStopPlaceWithEstimatedCalls } from '../../../logic/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import { useSettings } from '../../../settings/SettingsProvider'
import { NeoDepartureTableRow } from './NeoDepartureTable/NeoDepartureTableRow'
import classes from './NeoDepartureTile.module.scss'

const NeoDepartureTile: React.FC<{ stopPlaceId: string }> = ({
    stopPlaceId,
}) => {
    const [settings] = useSettings()
    const { stopPlaceWithEstimatedCalls, loading } =
        useStopPlaceWithEstimatedCalls({ stopPlaceId })

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
        <Tile className={classes.NeoTile}>
            <h2 className={classes.Heading}>
                {stopPlaceWithEstimatedCalls.name}
            </h2>
            <table className={classes.DepartureTable}>
                <thead>
                    <tr className={classes.TableHeader}>
                        <th className={classes.RouteNumberTableHeader}>
                            Linje
                        </th>
                        <th></th>
                        <th>Avgang</th>
                    </tr>
                </thead>
                <tbody>
                    {departures.map((departure) => (
                        <NeoDepartureTableRow
                            departure={departure}
                            key={departure.id}
                        />
                    ))}
                </tbody>
            </table>
        </Tile>
    )
}

export { NeoDepartureTile }
