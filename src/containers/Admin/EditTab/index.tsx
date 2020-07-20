import React, { useState, useMemo, useEffect, useCallback } from 'react'

import './styles.scss'

import DistanceEditor from './DistanceEditor'
import StopPlacePanel from './StopPlacePanel'
import BikePanelSearch from './BikeSearch'
import StopPlaceSearch from './StopPlaceSearch'
import BikePanel from './BikePanel'

import { useSettingsContext, Mode } from '../../../settings'
import { useDebounce, toggleValueInList } from '../../../utils'
import { DEFAULT_DISTANCE } from '../../../constants'
import { StopPlaceWithLines } from '../../../types'
import { useNearestPlaces } from '../../../logic'
import service, { getStopPlacesWithLines } from '../../../service'

import { BikeRentalStation } from '@entur/sdk'

import { Heading2 } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { Switch } from '@entur/form'

const EditTab = (): JSX.Element => {
    const [settings, settingsSetters] = useSettingsContext()
    const { newStops, newStations, hiddenModes } = settings
    const { setNewStops, setNewStations, setHiddenModes } = settingsSetters
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
        let ignoreResponse = false

        const ids = [...newStops, ...nearestStopPlaceIds]

        getStopPlacesWithLines(ids.map((id) => id.replace(/-\d+$/, ''))).then(
            (resultingStopPlaces) => {
                if (ignoreResponse) return

                setStopPlaces(
                    resultingStopPlaces.map((s, index) => ({
                        ...s,
                        id: ids[index],
                    })),
                )
            },
        )

        return (): void => {
            ignoreResponse = true
        }
    }, [nearestPlaces, nearestStopPlaceIds, newStops])

    useEffect(() => {
        let ignoreResponse = false

        const nearestBikeRentalStationIds = nearestPlaces
            .filter(({ type }) => type === 'BikeRentalStation')
            .map(({ id }) => id)

        const ids = [...newStations, ...nearestBikeRentalStationIds]

        service.getBikeRentalStations(ids).then((freshStations) => {
            if (ignoreResponse) return

            const sortedStations = freshStations.sort(
                (a: BikeRentalStation, b: BikeRentalStation) =>
                    a.name.localeCompare(b.name, 'no'),
            )
            setStations(sortedStations)
        })

        return (): void => {
            ignoreResponse = true
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

    const toggleMode = useCallback(
        (mode: Mode) => {
            setHiddenModes(toggleValueInList(hiddenModes, mode))
        },
        [setHiddenModes, hiddenModes],
    )

    return (
        <div className="edit-tab">
            <Heading2 className="heading">Rediger innhold</Heading2>
            <GridContainer spacing="extraLarge">
                <GridItem medium={8} small={12}>
                    <div className="edit-tab__header">
                        <Heading2>Kollektiv</Heading2>
                        <Switch
                            onChange={(): void => toggleMode('kollektiv')}
                            checked={!hiddenModes.includes('kollektiv')}
                            size="large"
                        />
                    </div>
                    <div className="edit-tab__set-stops">
                        <StopPlaceSearch handleAddNewStop={addNewStop} />
                        <DistanceEditor
                            distance={distance}
                            onDistanceUpdated={setDistance}
                        />
                    </div>
                    <StopPlacePanel stops={stopPlaces} />
                </GridItem>

                <GridItem medium={4} small={12}>
                    <div className="edit-tab__header">
                        <Heading2>Bysykkel</Heading2>
                        <Switch
                            onChange={(): void => toggleMode('bysykkel')}
                            checked={!hiddenModes.includes('bysykkel')}
                            size="large"
                        />
                    </div>
                    <BikePanelSearch
                        position={settings.coordinates}
                        onSelected={addNewStation}
                    />
                    <BikePanel stations={stations} />
                </GridItem>
            </GridContainer>
        </div>
    )
}

export default EditTab
