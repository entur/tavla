import React from 'react'
import { CityBikeIcon } from '../../../../assets/icons/CityBikeIcon'
import { NumberDisplay } from '../NumberDisplay/NumberDisplay'

const BikeTile = ({ numberOfBikes }: BikeTileProps) => (
    <>
        <CityBikeIcon />
        <NumberDisplay numberOfVehicles={numberOfBikes} />
    </>
)

interface BikeTileProps {
    numberOfBikes: number
}

export { BikeTile }
