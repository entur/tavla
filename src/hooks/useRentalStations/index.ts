import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import {
    FormFactor,
    useRentalStationsQuery,
} from 'graphql-generated/mobility-v2'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { REFRESH_INTERVAL } from 'utils/constants'
import { RentalStation } from 'src/types'
import { toStruct } from 'utils/utils'
import { useStationIds } from '../useStationIds'
import { RentalStationStruct } from './structs'

function useRentalStations(
    formFactors?: FormFactor[],
    filterHiddenRoutes: boolean | undefined = true,
): {
    rentalStations: RentalStation[]
    loading: boolean
    error: ApolloError | undefined
} {
    const {
        stationIds,
        loading: allStationIdsLoading,
        error: allStationIdsError,
    } = useStationIds({ formFactors, filterHiddenRoutes })

    const { data, loading, error } = useRentalStationsQuery({
        skip: allStationIdsLoading,
        fetchPolicy: 'cache-and-network',
        pollInterval: REFRESH_INTERVAL,
        variables: {
            ids: stationIds,
        },
    })

    const rentalStations = useMemo(
        () =>
            data?.stationsById
                ?.map(toStruct(RentalStationStruct))
                .filter(isNotNullOrUndefined) ?? [],
        [data?.stationsById],
    )

    return {
        rentalStations,
        loading: loading || allStationIdsLoading,
        error: error || allStationIdsError,
    }
}

export { useRentalStations }
