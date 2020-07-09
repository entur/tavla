import React, { useState, useMemo, useEffect, useCallback } from 'react'

import '../styles.scss'

import DistanceEditor from './DistanceEditor'
import ModePanel from './ModePanel'
import StopPlacePanel from './StopPlacePanel'
import BikePanelSearch from './BikeSearch'
import StopPlaceSearch from './StopPlaceSearch'
import BikePanel from './BikePanel'

import { useSettingsContext } from '../../../settings'
import { useDebounce, isLegMode, unique } from '../../../utils'
import { DEFAULT_DISTANCE } from '../../../constants'
import { StopPlaceWithLines } from '../../../types'
import { useNearestPlaces } from '../../../logic'
import service, { getStopPlacesWithLines } from '../../../service'

import { BikeRentalStation, LegMode, TransportSubmode } from '@entur/sdk'

import { Heading2 } from '@entur/typography'

const EditTab = (): JSX.Element => {
    const [settings, settingsSetters] = useSettingsContext()
    const { hiddenModes, newStops, newStations } = settings
    const { setHiddenModes, setNewStops, setNewStations } = settingsSetters
    const [distance, setDistance] = useState<number>(
        settings.distance || DEFAULT_DISTANCE,
    )
    const debouncedDistance = useDebounce(distance, 800)

    useEffect(() => {
        if (settings.distance != debouncedDistance) {
            settingsSetters.setDistance(debouncedDistance)
        }
    }, [debouncedDistance, settingsSetters, settings.distance])

    const [stopPlaces, setStopPlaces] = useState<StopPlaceWithLines[]>([])
    const [stations, setStations] = useState<BikeRentalStation[]>([])

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
            getStopPlacesWithLines(
                ids.map((id) => id.replace(/-\d+$/, '')),
            ).then((resultingStopPlaces) => {
                setStopPlaces(
                    resultingStopPlaces.map((s, index) => ({
                        ...s,
                        id: ids[index],
                    })),
                )
            })
        }
    }, [nearestPlaces, nearestStopPlaceIds, newStops])

    useEffect(() => {
        const nearestBikeRentalStationIds = nearestPlaces
            .filter(({ type }) => type === 'BikeRentalStation')
            .map(({ id }) => id)
        const ids = [...newStations, ...nearestBikeRentalStationIds]
        if (ids.length) {
            service.getBikeRentalStations(ids).then((freshStations) => {
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
                .map((id) => id.replace(/-\d+$/, ''))
                .filter((id) => id === stopId).length
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
            .map((stopPlace) =>
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

    return (
        <div>
            <Heading2>Rediger innhold</Heading2>
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
        </div>
    )
}

export default EditTab
