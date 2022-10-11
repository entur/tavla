import React, { useMemo } from 'react'
import { compareAsc } from 'date-fns'
import { TransportMode } from '@entur/sdk'
import { useStopPlacesWithDepartures } from '../../../logic'
import { BusTile } from './BusTile/BusTile'
import { Heading } from './Heading/Heading'
import { MobilityTiles } from './MobilityTiles/MobilityTiles'
import './Content.scss'

const Content = ({ numberOfBikes }: Props): JSX.Element | null => {
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const busDepartures = useMemo(
        () =>
            stopPlacesWithDepartures
                ?.flatMap((stopPlace) => stopPlace.departures)
                .filter((departure) => departure.type === TransportMode.BUS)
                .sort((a, b) => compareAsc(a.departureTime, b.departureTime))
                .slice(0, 3) ?? [],
        [stopPlacesWithDepartures],
    )

    if (!stopPlacesWithDepartures) {
        return <></>
    }

    return (
        <div className="content-wrapper">
            <Heading />
            <BusTile departures={busDepartures} />
            <MobilityTiles numberOfBikes={numberOfBikes} />
        </div>
    )
}

type Props = {
    numberOfBikes: number
}

export { Content }
