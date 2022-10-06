import { GridItem } from '@entur/grid'
import React from 'react'
import { useStopPlacesWithDepartures } from '../../../logic'
import BusTile from './BusTile'

import Heading from './Heading'
import MobilityOptions from './MobilityTiles'

import './styles.scss'

const Content = ({ numberOfBikes }: Props): JSX.Element | null => {
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    if (stopPlacesWithDepartures) {
        // const stopIndex = stopPlacesWithDepartures.findIndex(
        //     (p) => p.id == item.id,
        // )

        // const stopPlace = stopPlacesWithDepartures[stopIndex]
        const stopPlace = stopPlacesWithDepartures[1]

        if (stopPlace) {
            return (
                <div className="content-wrapper">
                    <Heading />
                    <BusTile stopPlaceWithDepartures={stopPlace} />
                    <MobilityOptions numberOfBikes={numberOfBikes} />
                </div>
            )
        }

        // return stopPlace ? (
        //     <div key={item.id}>
        //         <DepartureTile
        //             walkInfo={getWalkInfoForStopPlace(walkInfo || [], item.id)}
        //             stopPlaceWithDepartures={stopPlace}
        //         />
        //     </div>
        // ) : (
        //     []
        // )
    }

    return <p>Funket ikke</p>
}

type Props = {
    numberOfBikes: number
}

export default Content
