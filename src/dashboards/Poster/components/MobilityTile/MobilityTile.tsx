import React from 'react'
import classNames from 'classnames'
import { NumberDisplay } from '../NumberDisplay/NumberDisplay'

interface MobilityTileProps {
    vertical: boolean
    icon: React.ReactNode
    numberOfVehicles: number
    header: string
    description: string
}

const MobilityTile: React.FC<MobilityTileProps> = ({
    vertical,
    header,
    description,
    numberOfVehicles,
    icon,
}: MobilityTileProps) => (
    <div
        className={classNames({
            'poster-mobility-tile': true,
            'poster-mobility-tile--listed': vertical,
        })}
    >
        <div className="poster-mobility-description">
            <h2 className="poster-mobility-description-heading">{header}</h2>
            <h3 className="poster-mobility-description-area">{description}</h3>
        </div>
        <div
            className={classNames({
                'poster-mobility-vehicles-box': true,
                'poster-mobility-vehicles-box--listed': vertical,
            })}
        >
            {icon}
            <NumberDisplay numberOfVehicles={numberOfVehicles} />
        </div>
    </div>
)

export { MobilityTile }
