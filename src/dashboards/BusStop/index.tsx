import React from 'react'
import { GridContainer, GridItem } from '@entur/grid'

import DashboardWrapper from '../../containers/DashboardWrapper'

import { DEFAULT_ZOOM } from '../../constants'
import {
    useBikeRentalStations,
    useStopPlacesWithDepartures,
    useScooters,
    useWalkInfo,
} from '../../logic'
import { WalkInfo } from '../../logic/useWalkInfo'

import { useSettingsContext } from '../../settings'

import DepartureTile from './DepartureTile'

import MapTile from './MapTile'

import './styles.scss'

function getWalkInfoForStopPlace(
    walkInfos: WalkInfo[],
    id: string,
): WalkInfo | undefined {
    return walkInfos?.find((walkInfo) => walkInfo.stopId === id)
}

function BusStop({ history }: Props): JSX.Element | null {
    const [settings] = useSettingsContext()
    const bikeRentalStations = useBikeRentalStations()
    let stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const scooters = useScooters()

    if (stopPlacesWithDepartures) {
        stopPlacesWithDepartures = stopPlacesWithDepartures.filter(
            ({ departures }) => departures.length > 0,
        )
    }

    const walkInfo = useWalkInfo(stopPlacesWithDepartures)

    const mediumWidth = settings?.showMap ? 8 : 12
    return (
        <DashboardWrapper
            className="busStop"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            <GridContainer>
                <GridItem large={mediumWidth} medium={12} small={12}>
                    <div className={!settings?.showMap ? 'busStop__tiles' : ''}>
                        {(stopPlacesWithDepartures || []).map((stop, index) => (
                            <DepartureTile
                                key={index.toString()}
                                stopPlaceWithDepartures={stop}
                                walkInfo={getWalkInfoForStopPlace(
                                    walkInfo || [],
                                    stop.id,
                                )}
                            />
                        ))}
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
                ) : null}
            </GridContainer>
        </DashboardWrapper>
    )
}
interface Props {
    history: any
}

export default BusStop
