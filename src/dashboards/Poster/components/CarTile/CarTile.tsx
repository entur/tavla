import React, { useMemo } from 'react'
import { MobilityTile } from '../MobilityTile/MobilityTile'
import { useRentalStations } from '../../../../logic'
import { FormFactor } from '../../../../../graphql-generated/mobility-v2'
import { RentalCarIcon } from '../../../../assets/icons/RentalCarIcon'

const CarTile = () => {
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
