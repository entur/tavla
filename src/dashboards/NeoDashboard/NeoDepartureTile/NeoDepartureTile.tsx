import React, { useMemo } from 'react'
import { EmptyStopTile } from '../../../components/EmptyStopTile/EmptyStopTile'
import { ErrorTile } from '../../../components/ErrorTile/ErrorTile'
import { Loader } from '../../../components/Loader/Loader'
import { Tile } from '../../../components/Tile/Tile'
import { TransportModeIcon } from '../../../components/TransportModeIcon/TransportModeIcon'
import {
    byDepartureTime,
    filterHidden,
    toDeparture,
} from '../../../logic/use-stop-place-with-estimated-calls/departure'
import { useStopPlaceWithEstimatedCalls } from '../../../logic/use-stop-place-with-estimated-calls/useStopPlaceWithEstimatedCalls'
import { useSettings } from '../../../settings/SettingsProvider'
import { IconColorType } from '../../../types'
import { getIconColor } from '../../../utils/icon'
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
            <h2>{stopPlaceWithEstimatedCalls.name}</h2>
            <table className={classes.DepartureTable}>
                <thead>
                    <tr>
                        <th>Linje</th>
                        <th>Destinasjon</th>
                        <th>Avgang</th>
                    </tr>
                </thead>
                <tbody>
                    {departures.map((departure) => (
                        <tr key={departure.id}>
                            <td>
                                <span
                                    className={classes.RouteNumber}
                                    style={{
                                        backgroundColor: getIconColor(
                                            departure.transportMode,
                                            IconColorType.DEFAULT,
                                        ),
                                    }}
                                >
                                    <TransportModeIcon
                                        transportMode={departure.transportMode}
                                        color="white"
                                    />
                                    {departure.publicCode}
                                </span>
                            </td>
                            <td>{departure.frontText}</td>
                            <td>{departure.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Tile>
    )
}

export { NeoDepartureTile }
