import React from 'react'
import { ScooterIcon } from '../../../../assets/icons/ScooterIcon'
import { MobilityTile } from '../MobilityTile/MobilityTile'
import { useSettings } from '../../../../settings/SettingsProvider'
import { useMobility } from '../../../../logic'
import { FormFactor } from '../../../../../graphql-generated/mobility-v2'

const ScooterTile = (): JSX.Element => {
    const [settings] = useSettings()

    const numberOfScooters = useMobility(FormFactor.Scooter)?.length || 0

    if (settings?.hiddenModes.includes('sparkesykkel')) return <></>

    return (
        <MobilityTile
            icon={<ScooterIcon />}
            header="Elsparkesykler"
            description={`Innen ${settings?.distance || 0} meters radius`}
            numberOfVehicles={numberOfScooters}
            vertical={false}
        />
    )
}

export { ScooterTile }
