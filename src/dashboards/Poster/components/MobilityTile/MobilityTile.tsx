import React from 'react'
import classNames from 'classnames'
import { NumberDisplay } from '../NumberDisplay/NumberDisplay'
import { useSettings } from '../../../../settings/SettingsProvider'
import './MobilityTile.scss'

interface MobilityTileProps {
    icon: React.ReactNode
    numberOfVehicles: number
    header: string
    description: string
}

const MobilityTile: React.FC<MobilityTileProps> = ({
    header,
    description,
    numberOfVehicles,
    icon,
}: MobilityTileProps) => {
    const [settings] = useSettings()
    const vertical = settings.hiddenModes.includes('kollektiv')

    const mobilityTileClass = classNames('poster-mobility-tile', {
        'poster-mobility-tile--listed': vertical,
    })

    return (
        <div className={mobilityTileClass}>
            <div className="poster-mobility-tile-description">
                <h2 className="poster-mobility-tile-description-heading">
                    {header}
                </h2>
                <h3 className="poster-mobility-tile-description-area">
                    {description}
                </h3>
            </div>
            <div className="poster-mobility-tile-vehicles-box">
                {icon}
                <NumberDisplay numberOfVehicles={numberOfVehicles} />
            </div>
        </div>
    )
}

export { MobilityTile }
