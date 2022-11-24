import React from 'react'
import { MobilityTile } from '../MobilityTile/MobilityTile'
import { useSettings } from '../../../../settings/SettingsProvider'
import { useRentalStations } from '../../../../logic/use-rental-stations/useRentalStations'
import { FormFactor } from '../../../../../graphql-generated/mobility-v2'
import { CityBikeIcon } from '../../../../assets/icons/CityBikeIcon'

const BikeTile = () => {
    const [settings] = useSettings()

    const { rentalStations } = useRentalStations([FormFactor.Bicycle])

    return (
        <MobilityTile
            icon={<CityBikeIcon />}
            header="Bysykler"
            description={`Innen ${settings.distance} meters radius`}
            numberOfVehicles={rentalStations.length}
        />
    )
}

export { BikeTile }
