import React from 'react'

import { ScooterOperator, Scooter } from '@entur/sdk'
import ScooterRow from './ScooterRow'

import { ScooterIcon } from '@entur/icons'
import { useSettingsContext } from '../../../settings'

import { Heading2 } from '@entur/typography'
import ScooterOperatorLogo from '../../../assets/icons/scooterOperatorLogo'

import './styles.scss'

function ScooterTile({ scooters }: Props): JSX.Element {
    const [settings] = useSettingsContext()

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
            {Object.entries(scooters || {})
                .filter((operator) => operator[1].length > 0)
                .map((row) => {
                    const operator = row[0] as ScooterOperator
                    const logo = operator
                    if (settings?.distance) {
                        return (
                            <ScooterRow
                                key={operator}
                                icon={
                                    <ScooterOperatorLogo
                                        logo={logo}
                                        width={'32px'}
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
}

interface Props {
    scooters: Record<ScooterOperator, Scooter[]>
}

export default ScooterTile
