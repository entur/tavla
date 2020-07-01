import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@entur/button'
import { BikeRentalStation, LegMode, TransportSubmode } from '@entur/sdk'
import { Contrast } from '@entur/layout'

import StopPlacePanel from './StopPlacePanel'
import BikePanel from './BikePanel'
import ModePanel from './ModePanel'
import DistanceEditor from './DistanceEditor'

import { useDebounce, isLegMode, unique, getDocumentId } from '../../utils'

import service, { getStopPlacesWithLines } from '../../service'
import { StopPlaceWithLines } from '../../types'

import { useSettingsContext } from '../../settings'
import { useNearestPlaces } from '../../logic'

import AdminHeader from './AdminHeader'

import BikePanelSearch from './BikeSearch'
import StopPlaceSearch from './StopPlaceSearch'

import './styles.scss'

const AdminPage = ({ history }: Props): JSX.Element => {
    const [settings, settingsSetters, persistSettings] = useSettingsContext()

    const { hiddenModes, newStops, newStations } = settings

    const { setHiddenModes, setNewStops, setNewStations } = settingsSetters

    const [distance, setDistance] = useState(settings.distance)
    const debouncedDistance = useDebounce(distance, 800)
    useEffect(() => {
        if (settings.distance != debouncedDistance) {
            settingsSetters.setDistance(debouncedDistance)
        }
    }, [debouncedDistance, settingsSetters, settings.distance])

    const [stopPlaces, setStopPlaces] = useState<Array<StopPlaceWithLines>>([])
    const [stations, setStations] = useState<Array<BikeRentalStation>>([])

    const nearestPlaces = useNearestPlaces(
        settings.coordinates,
        debouncedDistance,
    )

    const nearestStopPlaceIds = useMemo(
        () =>
            nearestPlaces
                .filter(({ type }) => type === 'StopPlace')
                .map(({ id }) => id),
        [nearestPlaces],
    )

    useEffect(() => {
        const ids = [...newStops, ...nearestStopPlaceIds]
        if (ids.length) {
            getStopPlacesWithLines(ids.map(id => id.replace(/-\d+$/, ''))).then(
                resultingStopPlaces => {
                    setStopPlaces(
                        resultingStopPlaces.map((s, index) => ({
                            ...s,
                            id: ids[index],
                        })),
                    )
                },
            )
        }
    }, [nearestPlaces, nearestStopPlaceIds, newStops])

    useEffect(() => {
        const nearestBikeRentalStationIds = nearestPlaces
            .filter(({ type }) => type === 'BikeRentalStation')
            .map(({ id }) => id)
        const ids = [...newStations, ...nearestBikeRentalStationIds]
        if (ids.length) {
            service.getBikeRentalStations(ids).then(freshStations => {
                const sortedStations = freshStations.sort(
                    (a: BikeRentalStation, b: BikeRentalStation) =>
                        a.name.localeCompare(b.name, 'no'),
                )
                setStations(sortedStations)
            })
        }
    }, [nearestPlaces, newStations])

    const addNewStop = useCallback(
        (stopId: string) => {
            const numberOfDuplicates = [...nearestStopPlaceIds, ...newStops]
                .map(id => id.replace(/-\d+$/, ''))
                .filter(id => id === stopId).length
            const id = !numberOfDuplicates
                ? stopId
                : `${stopId}-${numberOfDuplicates}`
            setNewStops([...newStops, id])
        },
        [nearestStopPlaceIds, newStops, setNewStops],
    )

    const addNewStation = useCallback(
        (stationId: string) => {
            setNewStations([...newStations, stationId])
        },
        [newStations, setNewStations],
    )

    const modes: Array<{
        mode: LegMode
        subMode?: TransportSubmode
    }> = useMemo(() => {
        const modesFromStopPlaces = stopPlaces
            .map(stopPlace =>
                stopPlace.lines.map(({ transportMode, transportSubmode }) => ({
                    mode: transportMode,
                    subMode: transportSubmode,
                })),
            )
            .reduce((a, b) => [...a, ...b], [])
            .filter(({ mode }) => isLegMode(mode))

        const uniqModesFromStopPlaces = unique(
            modesFromStopPlaces,
            (a, b) => a.mode === b.mode,
        )

        return stations.length
            ? [{ mode: 'bicycle' }, ...uniqModesFromStopPlaces]
            : uniqModesFromStopPlaces
    }, [stations.length, stopPlaces])

    const documentId = getDocumentId()
    const discardSettingsAndGoToDash = useCallback(() => {
        const answerIsYes = confirm(
            'Er du sikker på at du vil gå tilbake uten å lagre endringene dine? Lagre-knapp finner du nederst til høyre på siden.',
        )
        if (answerIsYes) {
            if (documentId) {
                window.location.pathname = window.location.pathname.replace(
                    'admin',
                    't',
                )
            } else {
                window.location.pathname = window.location.pathname.replace(
                    'admin',
                    'dashboard',
                )
            }
        }
    }, [documentId])

    const submitSettingsAndGoToDash = useCallback(() => {
        persistSettings()
        if (documentId) {
            history.push(window.location.pathname.replace('admin', 't'))
        }
        history.push(window.location.pathname.replace('admin', 'dashboard'))
    }, [history, persistSettings, documentId])

    return (
        <Contrast className="admin">
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
                {!hiddenModes.includes('bicycle') ? (
                    <div className="admin__selection-panel">
                        <div className="search-stop-places">
                            <BikePanelSearch
                                position={settings.coordinates}
                                onSelected={addNewStation}
                            />
                        </div>
                        <BikePanel stations={stations} />
                    </div>
                ) : null}
            </div>
            <Button
                className="admin__submit-button"
                variant="primary"
                onClick={submitSettingsAndGoToDash}
            >
                Oppdater tavla
            </Button>
        </Contrast>
    )
}

interface Props {
    history: any
}

export default AdminPage
