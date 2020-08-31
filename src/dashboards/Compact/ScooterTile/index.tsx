import React, { useState } from 'react'
import ReactMapGL from 'react-map-gl'

import { ScooterOperator, Scooter } from '@entur/sdk'
import ScooterRow from './ScooterRow'

import { ScooterIcon } from '@entur/icons'
import { useSettingsContext } from '../../../settings'

import { Heading2 } from '@entur/typography'
import ScooterOperatorLogo from '../../../assets/icons/scooterOperatorLogo'

import './styles.scss'

function ScooterTile({ scooters }: Props): JSX.Element {
    const [settings] = useSettingsContext()
    const [viewport, setViewPort] = useState({
        latitude: 59.909,
        longitude: 10.746,
        zoom: 10,
        width: '400',
        height: '400',
    })

    if (!(Object.entries(scooters || {}).length > 0)) {
        return (
            <div>
                <h1>Laster inn scooters</h1>
            </div>
        )
    }
    return (
        <div className="scootertile">
            <header className="scootertile__header">
                <Heading2>Sparkesykler</Heading2>
                <div className="scootertile__header-icons">
                    <ScooterIcon />
                </div>
            </header>
            <ReactMapGL {...viewport} mapboxApiAccessToken={'tokens goes here'}>
                bike
            </ReactMapGL>
        </div>
    )
}

interface Props {
    scooters: Record<ScooterOperator, Scooter[]>
}

export default ScooterTile
