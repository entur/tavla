import React, { useState, useCallback } from 'react'
import { Heading2 } from '@entur/typography'

import './styles.scss'
import RadioCard from '../../../components/RadioCard'
import CompactSVG from '../../../assets/previews/Kompakt.svg'
import ChronoSVG from '../../../assets/previews/Kronologisk.svg'
import TimelineSVG from '../../../assets/previews/Tidslinje.svg'
import { useSettingsContext } from '../../../settings'

const DashboardPickerTab = (): JSX.Element => {
    const [settings, { setDashboard }] = useSettingsContext()
    const [radioValue, setRadioValue] = useState<string>(
        settings.dashboard || 'Compact',
    )

    const updateChoice = useCallback(
        (value: string) => {
            event.preventDefault()
            if (value != radioValue) {
                setRadioValue(value)
                setDashboard(value)
            }
        },
        [radioValue, setRadioValue, setDashboard],
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

export default DashboardPickerTab
