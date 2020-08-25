import React, { useState, useEffect } from 'react'

import service from '../../../../service'
import { ScooterOperator, Scooter } from '@entur/sdk'
import ScooterRow from './ScooterRow'

import { ScooterIcon } from '@entur/icons'
import { useSettingsContext } from '../../../../settings'

import VoiLogo from '../../../../assets/icons/voiLogo'
import TierLogo from '../../../../assets/icons/tierLogo'
import LimeLogo from '../../../../assets/icons/limeLogo'

import './styles.scss'

function countScootersByOperator(list: Scooter[]) {
    let operators: Record<ScooterOperator, Scooter[]> = {
        voi: [],
        tier: [],
        lime: [],
        zvipp: [],
    }
    list.map((scooter) => operators[scooter.operator].push(scooter))
    return operators
}

function ScooterView(): JSX.Element {
    const [settings] = useSettingsContext()
    const [scooters, setScooters] = useState<Scooter[]>([])

    useEffect(() => {
        if (settings?.coordinates && settings?.distance) {
            service
                .getScootersByPosition({
                    latitude: settings?.coordinates?.latitude,
                    longitude: settings?.coordinates?.longitude,
                    distance: settings?.distance,
                    limit: 50,
                    //operators: ['TIER', 'VOI'], // Use the ScooterOperator enum if using TypeScript
                })
                .then(setScooters)
        }
    }, [settings])

    if (scooters.length > 0 && settings?.distance) {
        const sortedOperators = countScootersByOperator(scooters)
        console.log(sortedOperators)
        return (
            <div className="scooterview">
                <header className="scooterview__header">
                    <h2>Sparkesykler</h2>
                    <div className="scooterview__header-icons">
                        <ScooterIcon />
                    </div>
                </header>
                <ScooterRow
                    icon={<VoiLogo height={'25px'} />}
                    operator="Voi"
                    counter={sortedOperators.voi.length}
                    distance={settings?.distance}
                />
                <ScooterRow
                    icon={<TierLogo height={'25px'} />}
                    operator="Tier"
                    counter={sortedOperators.tier.length}
                    distance={settings?.distance}
                />
                <ScooterRow
                    icon={<LimeLogo height={'25px'} />}
                    operator="Lime"
                    counter={sortedOperators.lime.length}
                    distance={settings?.distance}
                />
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


export default ScooterView
