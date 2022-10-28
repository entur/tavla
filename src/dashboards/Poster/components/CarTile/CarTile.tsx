import React, { useMemo } from 'react'
import { MobilityTile } from '../MobilityTile/MobilityTile'
import { useSettings } from '../../../../settings/SettingsProvider'
import { useRentalStations } from '../../../../logic'
import { FormFactor } from '../../../../../graphql-generated/mobility-v2'
import { RentalCarIcon } from '../../../../assets/icons/RentalCarIcon'

const CarTile = () => {
    const [settings] = useSettings()

    const carRentalStations = useRentalStations(true, FormFactor.Car)
    const totalNumberOfCars = useMemo(
        () =>
            carRentalStations?.reduce(
                (numberOfCars, station) =>
                    numberOfCars + station.numBikesAvailable,
                0,
            ),
        [carRentalStations],
    )

    if (settings?.hiddenModes.includes('delebil')) return <></>

    return (
        <MobilityTile
            icon={<RentalCarIcon />}
            header="Delebiler"
            description="P-plassen ved Vestveien"
            numberOfVehicles={totalNumberOfCars}
        />
    )
}

export { CarTile }
