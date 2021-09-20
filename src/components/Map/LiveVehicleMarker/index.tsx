import React from 'react'
import './styles.scss'

interface IProps {
    lineNumber: number
    color: string
}

export const LiveVehicleMarker = ({
    lineNumber,
    color,
}: IProps): JSX.Element => (
    <div className="wrapper_outer">
        <div className="wrapper_inner" style={{ backgroundColor: color }}>
            {lineNumber}
        </div>
    </div>
)
