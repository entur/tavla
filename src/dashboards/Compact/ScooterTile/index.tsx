import React from 'react'

import service from '../../../service'
import { ScooterOperator, Scooter } from '@entur/sdk'
import ScooterRow from './ScooterRow'

import { ScooterIcon } from '@entur/icons'
import { useSettingsContext } from '../../../settings'

import ScooterOperatorLogo from '../../../assets/icons/scooterOperatorLogo'

import './styles.scss'

function ScooterTile({ scooters }: Props): JSX.Element {
    const [settings] = useSettingsContext()

    if (Object.entries(scooters)) {
        return (
            <div className="scooterview">
                <header className="scooterview__header">
                    <h2>Sparkesykler</h2>
                    <div className="scooterview__header-icons">
                        <ScooterIcon />
                    </div>
                </header>
                {Object.entries(scooters)
                    .filter((operator) => operator[1].length > 0)
                    .map((row) => {
                        let operator = row[0]
                        let logo = `${
                            operator.charAt(0).toUpperCase() + operator.slice(1)
                        }`
                        if (settings?.distance) {
                            return (
                                <ScooterRow
                                    key={operator}
                                    icon={
                                        <ScooterOperatorLogo
                                            logo={logo}
                                            height={'25px'}
                                        />
                                    }
                                    operator={
                                        operator.charAt(0).toUpperCase() +
                                        operator.slice(1)
                                    }
                                    counter={row[1].length}
                                    distance={settings.distance}
                                />
                            )
                        }
                    })}
            </div>
        )
    } else {
        return (
            <div>
                <h1>Laster inn scooters</h1>
            </div>
        )
    }
}

interface Props {
    scooters: Record<ScooterOperator, Scooter[]>
}

export default ScooterTile
