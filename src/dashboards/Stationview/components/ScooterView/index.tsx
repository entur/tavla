import React, { useState, useEffect } from 'react'

import service from '../../../../service'
import { ScooterOperator, Scooter } from '@entur/sdk'
import ScooterRow from './ScooterRow'

import VoiLogo from '../../../../assets/icons/voiLogo'

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
    const [scooters, setScooters] = useState<Scooter[]>([])

    useEffect(() => {
        service
            .getScootersByPosition({
                latitude: 59.95,
                longitude: 10.75,
                distance: 200,
                //limit: 10,
                //operators: ['TIER', 'VOI'], // Use the ScooterOperator enum if using TypeScript
            })
            .then(setScooters)
    }, [])

    if (scooters.length > 0) {
        const sortedOperators = countScootersByOperator(scooters)
        console.log(sortedOperators)
        return (
            <div>
                <h1>Sparkesykler</h1>
                <ScooterRow
                    icon={<VoiLogo height={'20px'} />}
                    operator="Voi"
                    counter={sortedOperators.voi.length}
                />
                <ScooterRow
                    icon={<VoiLogo height={'20px'} />}
                    operator="Tier"
                    counter={sortedOperators.tier.length}
                />
                <ScooterRow
                    icon={<VoiLogo height={'20px'} />}
                    operator="Lime"
                    counter={sortedOperators.lime.length}
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
