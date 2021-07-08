import React from 'react'
import { GridContainer, GridItem } from '@entur/grid'

import DashboardWrapper from '../../containers/DashboardWrapper'

import { DEFAULT_ZOOM } from '../../constants'
import {
    useBikeRentalStations,
    useStopPlacesWithDepartures,
    useScooters,
} from '../../logic'

import { useSettingsContext } from '../../settings'

import DepartureTile from './DepartureTile'

import MapTile from './MapTile'

import './styles.scss'

function BusStop({ history }: Props): JSX.Element {
    const [settings] = useSettingsContext()
    const bikeRentalStations = useBikeRentalStations()
    let stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const scooters = useScooters()

    if (stopPlacesWithDepartures) {
        stopPlacesWithDepartures = stopPlacesWithDepartures.filter(
            ({ departures }) => departures.length > 0,
        )
    }
    const mediumWidth = settings?.showMap ? 8 : 12
    return (
        <DashboardWrapper
            className="busStop"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            <GridContainer spacing="extraLarge">
                <GridItem large={mediumWidth} medium={12} small={12}>
                    <div className="busStop__tiles">
                        {(stopPlacesWithDepartures || []).map((stop, index) => (
                            <DepartureTile
                                key={index.toString()}
                                stopPlaceWithDepartures={stop}
                            />
                        ))}{' '}
                    </div>
                </GridItem>
                {settings?.showMap ? (
                    <GridItem
                        large={4}
                        medium={12}
                        small={12}
                        className="busStop__mapTile"
                    >
                        <MapTile
                            scooters={scooters}
                            stopPlaces={stopPlacesWithDepartures}
                            bikeRentalStations={bikeRentalStations}
                            walkTimes={null}
                            latitude={settings?.coordinates?.latitude ?? 0}
                            longitude={settings?.coordinates?.longitude ?? 0}
                            zoom={settings?.zoom ?? DEFAULT_ZOOM}
                        />
                    </GridItem>
                ) : (
                    []
                )}
            </GridContainer>
        </DashboardWrapper>
    )
}
interface Props {
    history: any
}

export default BusStop
