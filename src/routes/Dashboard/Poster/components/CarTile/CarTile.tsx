import React, { useMemo } from 'react'
import { useRentalStations } from 'hooks/useRentalStations'
import { FormFactor } from 'graphql-generated/mobility-v2'
import { RentalCarIcon } from 'assets/icons/RentalCarIcon'
import { MobilityTile } from '../MobilityTile/MobilityTile'

function CarTile() {
    const { rentalStations } = useRentalStations([FormFactor.Car])
    const totalNumberOfCars = useMemo(
        () =>
            rentalStations.reduce(
                (numberOfCars, station) =>
                    numberOfCars + station.numBikesAvailable,
                0,
            ),
        [rentalStations],
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
