import React, { useMemo } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { useRentalStations } from 'hooks/use-rental-stations/useRentalStations'
import { FormFactor } from 'graphql-generated/mobility-v2'
import { CityBikeIcon } from 'assets/icons/CityBikeIcon'
import { MobilityTile } from '../MobilityTile/MobilityTile'

const BikeTile = () => {
    const [settings] = useSettings()
    const { rentalStations } = useRentalStations([FormFactor.Bicycle])
    const totalNumberOfBikes = useMemo(
        () =>
            rentalStations?.reduce(
                (numberOfBikes, station) =>
                    numberOfBikes + station.numBikesAvailable,
                0,
            ),
        [rentalStations],
    )

    return (
        <MobilityTile
            icon={<CityBikeIcon />}
            header="Bysykler"
            description={`Innen ${settings.distance} meters radius`}
            numberOfVehicles={totalNumberOfBikes}
        />
    )
}

export { BikeTile }
