import { useState, useEffect } from 'react'

import { gql } from '@apollo/client'

import { NearestPlace, Coordinates, TypeName } from '@entur/sdk'

import { isNotNullOrUndefined } from '../utils'
import { apolloClient } from '../service'

const GET_NEAREST_PLACES_QUERY = gql`
    query getNearestPlaces(
        $latitude: Float!
        $longitude: Float!
        $maximumDistance: Float!
        $filterByPlaceTypes: [FilterPlaceType]
        $multiModalMode: MultiModalMode
    ) {
        nearest(
            latitude: $latitude
            longitude: $longitude
            maximumDistance: $maximumDistance
            filterByPlaceTypes: $filterByPlaceTypes
            multiModalMode: $multiModalMode
        ) {
            edges {
                node {
                    distance
                    place {
                        __typename
                        id
                        latitude
                        longitude
                    }
                }
            }
        }
    }
`

type GetNearestPlacesVariables = {
    latitude: number
    longitude: number
    maximumDistance: number
    filterByPlaceTypes?: Array<
        | 'quay'
        | 'stopPlace'
        | 'bicycle'
        | 'bicycleRent'
        | 'bikePark'
        | 'carPark'
    >
    multiModalMode?: 'parent'
}

type Maybe<T> = T | null | undefined

type GetNearestPlacesResponse = {
    nearest: Maybe<{
        edges: Maybe<
            Array<{
                node: Maybe<{
                    distance: number
                    place: {
                        __typename: TypeName
                        id: string
                        latitude: number
                        longitude: number
                    }
                }>
            }>
        >
    }>
}

export default function useNearestPlaces(
    position: Coordinates | undefined,
    distance = 2000,
) {
    const [nearestPlaces, setNearestPlaces] = useState<NearestPlace[]>([])

    const { latitude, longitude } = position ?? {}

    useEffect(() => {
        if (!latitude || !longitude || !distance) return
        let ignoreResponse = false

        apolloClient
            .query<GetNearestPlacesResponse, GetNearestPlacesVariables>({
                query: GET_NEAREST_PLACES_QUERY,
                variables: {
                    latitude,
                    longitude,
                    maximumDistance: distance,
                    filterByPlaceTypes: ['stopPlace', 'bicycleRent'],
                    multiModalMode: 'parent',
                },
            })
            .then(({ data }) => {
                if (ignoreResponse) return

                const places: NearestPlace[] = (data?.nearest?.edges || [])
                    .map(({ node }) => {
                        if (!node) return undefined

                        const { place } = node

                        return {
                            distance: node.distance,
                            id: place.id,
                            type: place.__typename,
                            latitude: place.latitude,
                            longitude: place.longitude,
                        }
                    })
                    .filter(isNotNullOrUndefined)

                setNearestPlaces(places)
            })

        return (): void => {
            ignoreResponse = true
        }
    }, [distance, latitude, longitude])

    return nearestPlaces
}
