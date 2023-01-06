import React from 'react'
import { ScooterIcon } from '../../../../assets/icons/ScooterIcon'
import { MobilityTile } from '../MobilityTile/MobilityTile'
import { useSettings } from '../../../../settings/SettingsProvider'
import { useVehicles } from '../../../../logic/use-vehicles/useVehicles'
import { FormFactor } from '../../../../../graphql-generated/mobility-v2'

const ScooterTile = (): JSX.Element => {
    const [settings] = useSettings()

    const distance = settings.scooterDistance.enabled
        ? settings.scooterDistance.distance
        : settings.distance

    const { vehicles } = useVehicles(distance, [FormFactor.Scooter])

    return (
        <MobilityTile
            icon={<ScooterIcon />}
            header="Elsparkesykler"
            description={`Innen ${distance} meters radius`}
            numberOfVehicles={vehicles.length}
        />
    )
}

export { ScooterTile }
