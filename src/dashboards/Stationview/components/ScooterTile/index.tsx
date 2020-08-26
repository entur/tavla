import React, { useState, useEffect } from 'react'

import service from '../../../../service'
import { ScooterOperator, Scooter } from '@entur/sdk'
import ScooterRow from './ScooterRow'

import { ScooterIcon } from '@entur/icons'
import { useSettingsContext } from '../../../../settings'

import ScooterOperatorLogo from '../../../../assets/icons/scooterOperatorLogo'
import TierLogo from '../../../../assets/icons/tierLogo'
import LimeLogo from '../../../../assets/icons/limeLogo'

import './styles.scss'

function countScootersByOperator(
    list: Scooter[],
): Record<ScooterOperator, Scooter[]> {
    const operators: Record<ScooterOperator, Scooter[]> = {
        voi: [],
        tier: [],
        lime: [],
        zvipp: [],
    }
    console.log(operators)
    list.map((scooter) => operators[scooter.operator].push(scooter))
    return operators
}

function ScooterTile(): JSX.Element {
    const [settings] = useSettingsContext()
    const [scooters, setScooters] = useState<Scooter[]>([])

    useEffect(() => {
        if (settings?.coordinates && settings?.distance) {
            console.log('Dette er distansen: ')
            console.log(settings?.distance)
            service
                .getScootersByPosition({
                    latitude: settings.coordinates.latitude,
                    longitude: settings.coordinates.longitude,
                    distance: settings.distance,
                    limit: 50,
                    //operators: ['TIER', 'VOI'], // Use the ScooterOperator enum if using TypeScript
                })
                .then(setScooters)
        }
    }, [settings])

    if (scooters.length > 0) {
        const sortedOperators = countScootersByOperator(scooters)
        return (
            <div className="scooterview">
                <header className="scooterview__header">
                    <h2>Sparkesykler</h2>
                    <div className="scooterview__header-icons">
                        <ScooterIcon />
                    </div>
                </header>
                {Object.entries(sortedOperators)
                    .filter((operator) => operator[1].length > 0)
                    .map((row) => {
                        let operator = row[0]
                        let logo = `${
                            operator.charAt(0).toUpperCase() + operator.slice(1)
                        }`
                        console.log(logo)
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

export default ScooterTile
