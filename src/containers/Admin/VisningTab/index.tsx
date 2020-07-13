import React, { useState, useEffect, useCallback } from 'react'
import { Heading2 } from '@entur/typography'

import './styles.scss'
import RadioCard from '../../../components/RadioCard'
import CompactSVG from '../../../assets/previews/Kompakt.svg'
import ChronoSVG from '../../../assets/previews/Kronologisk.svg'
import TimelineSVG from '../../../assets/previews/Tidslinje.svg'

const VisningTab = ({ tabIndex, setTabIndex }: Props): JSX.Element => {
    const [radioValue, setRadioValue] = useState<string>('Compact')

    const updateChoice = useCallback(
        (value: string) => {
            event.preventDefault()
            if (value != radioValue) setRadioValue(value)
        },
        [radioValue, setRadioValue],
    )
    return (
        <div>
            <Heading2>Velg visning</Heading2>
            <div className="visning-wrapper">
                <RadioCard
                    title="Kompakt (standard)"
                    description="Alle avgangene til en linje vises på en samlet rad. Ikke egnet for linjer som varierer spor/plattform."
                    cardValue="Compact"
                    selected={radioValue === 'Compact'}
                    preview={CompactSVG}
                    callback={(val): void => updateChoice(val)}
                />
                <RadioCard
                    title="Kronologisk"
                    description="Avgangene vises i en kronologisk rekkefølge. Egner seg godt for linjer som varierer spor/plattform."
                    cardValue="Chrono"
                    selected={radioValue === 'Chrono'}
                    preview={ChronoSVG}
                    callback={(val): void => updateChoice(val)}
                />
                <RadioCard
                    title="Tidslinje"
                    description="Avgangene vises i en visualisert fremstilling. Viser ikke bysykkel, spor/plattform eller avvik."
                    cardValue="Timeline"
                    selected={radioValue === 'Timeline'}
                    preview={TimelineSVG}
                    callback={(val): void => updateChoice(val)}
                />
            </div>
        </div>
    )
}

interface Props {
    tabIndex: number
    setTabIndex: () => void
}

export default VisningTab
