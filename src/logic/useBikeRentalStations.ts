import { useState, useEffect, useMemo } from 'react'
import { isEqual } from 'lodash'
import { BikeRentalStation } from '@entur/sdk'

import { usePrevious, isNotNullOrUndefined } from '../utils'
import service from '../service'
import { useSettingsContext } from '../settings'
import { REFRESH_INTERVAL } from '../constants'

import useNearestPlaces from './useNearestPlaces'

async function fetchBikeRentalStations(
    allStationIds: string[],
): Promise<BikeRentalStation[] | null> {
    const allStations = await service.getBikeRentalStations(allStationIds)
    return allStations.filter(isNotNullOrUndefined)
}

export default function useBikeRentalStations(): BikeRentalStation[] | null {
    const [settings] = useSettingsContext()
    const [bikeRentalStations, setBikeRentalStations] = useState<
        BikeRentalStation[] | null
    >(null)
    const nearestPlaces = useNearestPlaces(
        settings?.coordinates,
        settings?.distance,
    )

    const { newStations, hiddenStations, hiddenModes } = settings || {}

    const nearestBikeRentalStations = useMemo(
        () =>
            nearestPlaces
                .filter(({ type }) => type === 'BikeRentalStation')
                .map(({ id }) => id),
        [nearestPlaces],
    )

    const allStationIds = (
        newStations
            ? [...newStations, ...nearestBikeRentalStations]
            : nearestBikeRentalStations
    )
        .filter((id) => !hiddenStations?.includes(id))
        .filter((id, index, ids) => ids.indexOf(id) === index)

    const prevStationIds = usePrevious(allStationIds)

    const isDisabled = Boolean(hiddenModes?.includes('bysykkel'))
    useEffect(() => {
        const isStationsEqual = isEqual(allStationIds, prevStationIds)
        if (isDisabled) {
            return setBikeRentalStations(null)
        }
        if (!isStationsEqual) {
            fetchBikeRentalStations(allStationIds).then(setBikeRentalStations)
        }
        const intervalId = setInterval(() => {
            fetchBikeRentalStations(allStationIds).then(setBikeRentalStations)
        }, REFRESH_INTERVAL)
        return (): void => clearInterval(intervalId)
    }, [allStationIds, isDisabled, prevStationIds])

    return bikeRentalStations
}
