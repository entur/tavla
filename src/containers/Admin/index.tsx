import React, {
    useState, useEffect, useMemo, useCallback,
} from 'react'
import { Button } from '@entur/component-library'
import { BikeRentalStation, LegMode } from '@entur/sdk'

import StopPlacePanel from './StopPlacePanel'
import BikePanel from './BikePanel'
import ModePanel from './ModePanel'
import DistanceEditor from './DistanceEditor'

import {
    getPositionFromUrl,
    useDebounce,
    isLegMode,
} from '../../utils'

import service, { getStopPlacesWithLines } from '../../service'
import { StopPlaceWithLines } from '../../types'

import { useSettingsContext } from '../../settings'
import { useNearestPlaces } from '../../state'

import AdminHeader from './AdminHeader'

import BikePanelSearch from './BikeSearch'
import StopPlaceSearch from './StopPlaceSearch'

import './styles.scss'

const AdminPage = ({ history }: Props): JSX.Element => {
    const position = useMemo(() => getPositionFromUrl(), [])
    const [settings, settingsSetters, persistSettings] = useSettingsContext()

    const {
        distance,
        hiddenModes,
        newStops,
        newStations,
    } = settings

    const {
        setHiddenModes,
        setDistance,
        setNewStops,
        setNewStations,
    } = settingsSetters

    const [stopPlaces, setStopPlaces] = useState<Array<StopPlaceWithLines>>([])
    const [stations, setStations] = useState<Array<BikeRentalStation>>([])

    const debouncedDistance = useDebounce(distance, 300)
    const nearestPlaces = useNearestPlaces(position, debouncedDistance)

    useEffect(() => {
        const nearestStopPlaceIds = nearestPlaces
            .filter(({ type }) => type === 'StopPlace')
            .map(({ id }) => id)
        const ids = [...newStops, ...nearestStopPlaceIds]
        if (ids.length) {
            getStopPlacesWithLines([...newStops, ...nearestStopPlaceIds])
                .then(setStopPlaces)
        }
    }, [nearestPlaces, newStops])

    useEffect(() => {
        const nearestBikeRentalStationIds = nearestPlaces
            .filter(({ type }) => type === 'BikeRentalStation')
            .map(({ id }) => id)
        const ids = [...newStations, ...nearestBikeRentalStationIds]
        if (ids.length) {
            service.getBikeRentalStations(ids)
                .then(setStations)
        }
    }, [nearestPlaces, newStations])

    const addNewStop = useCallback((stopId: string) => {
        setNewStops([...newStops, stopId])
    }, [newStops, setNewStops])

    const addNewStation = useCallback((stationId: string) => {
        setNewStations([...newStations, stationId])
    }, [newStations, setNewStations])

    const modes: Array<LegMode> = useMemo(
        () => {
            const modesFromStopPlaces = stopPlaces
                .map(stopPlace => stopPlace.lines.map(({ transportMode }) => transportMode))
                .reduce((a, b) => [...a, ...b], [])
                .filter(isLegMode)
                .filter((mode, index, array) => array.indexOf(mode) === index)
            return (stations.length)
                ? ['bicycle', ...modesFromStopPlaces]
                : modesFromStopPlaces
        },
        [stations.length, stopPlaces]
    )

    const discardSettingsAndGoToDash = useCallback(() => {
        history.push(window.location.pathname.replace('admin', 'dashboard'))
    }, [history])

    const submitSettingsAndGoToDash = useCallback(() => {
        persistSettings()
        history.push(window.location.pathname.replace('admin', 'dashboard'))
    }, [history, persistSettings])

    return (
        <div className="admin">
            <AdminHeader goBackToDashboard={discardSettingsAndGoToDash} />
            <div className="admin__content">
                <div className="admin__selection-panel">
                    <DistanceEditor
                        distance={distance}
                        onDistanceUpdated={setDistance}
                    />
                    <ModePanel
                        transportModes={modes}
                        disabledModes={hiddenModes}
                        onModesChange={setHiddenModes}
                    />
                </div>
                <div className="admin__selection-panel">
                    <div className="search-stop-places">
                        <StopPlaceSearch handleAddNewStop={addNewStop} />
                    </div>
                    <StopPlacePanel stops={stopPlaces} />
                </div>
                {
                    !hiddenModes.includes('bicycle') ? (
                        <div className="admin__selection-panel">
                            <div className="search-stop-places">
                                <BikePanelSearch
                                    position={position}
                                    onSelected={addNewStation}
                                />
                            </div>
                            <BikePanel stations={stations} />
                        </div>
                    ) : null
                }
            </div>
            <div className="admin__submit-button-container">
                <Button variant="secondary" onClick={submitSettingsAndGoToDash}>
                    Oppdater tavle
                </Button>
            </div>
        </div>
    )
}

interface Props {
    history: any,
}

export default AdminPage
