import React from 'react'
import { CityBikeIcon } from '@entur/icons'
import { MobilityTile } from '../MobilityTile/MobilityTile'
import { useSettings } from '../../../../settings/SettingsProvider'
import { useRentalStations } from '../../../../logic'
import { FormFactor } from '../../../../../graphql-generated/mobility-v2'

const BikeTile = () => {
    const [settings] = useSettings()

    const numberOfBikes = useRentalStations(true, FormFactor.Bicycle).length

    if (settings?.hiddenModes.includes('bysykkel')) return <></>

    return (
        <MobilityTile
            icon={<CityBikeIcon />}
            header="Bysykler"
            description={`Innen ${settings?.distance || 0} meters radius`}
            numberOfVehicles={numberOfBikes}
        />
    )
}

export { BikeTile }
