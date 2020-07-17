import React, { useState, useCallback, useEffect } from 'react'
import { Heading2 } from '@entur/typography'

import './styles.scss'

import RadioCard from '../../../components/RadioCard'

import { useSettingsContext } from '../../../settings'
import { ThemeDashbboardPreview } from '../../../assets/icons/ThemeDashboardPreview'

const DashboardPickerTab = (): JSX.Element => {
    const [settings, { setDashboard }] = useSettingsContext()
    const [compactSVG, setCompactSVG] = useState()
    const [chronoSVG, setChronoSVG] = useState()
    const [timelineSVG, setTimelineSVG] = useState()

    useEffect(() => {
        if (!settings) return
        const dashboardImages = ThemeDashbboardPreview(settings.theme)
        setCompactSVG(dashboardImages.Compact)
        setChronoSVG(dashboardImages.Chrono)
        setTimelineSVG(dashboardImages.Timeline)
    }, [settings])

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
            <Heading2 className="heading">Velg visning</Heading2>
            <div className="display-wrapper">
                <RadioCard
                    title="Kompakt (standard)"
                    description="Alle avgangene til en linje vises på en samlet rad. Ikke egnet for linjer som varierer spor/plattform."
                    cardValue="Compact"
                    selected={radioValue === 'Compact'}
                    preview={compactSVG}
                    callback={(val): void => updateChoice(val)}
                    className="display-wrapper__display-card"
                />
                <RadioCard
                    title="Kronologisk"
                    description="Avgangene vises i en kronologisk rekkefølge. Egner seg godt for linjer som varierer spor/plattform."
                    cardValue="Chrono"
                    selected={radioValue === 'Chrono'}
                    preview={chronoSVG}
                    callback={(val): void => updateChoice(val)}
                    className="display-wrapper__display-card"
                />
                <RadioCard
                    title="Tidslinje"
                    description="Avgangene vises i en visualisert fremstilling. Viser ikke bysykkel, spor/plattform eller avvik."
                    cardValue="Timeline"
                    selected={radioValue === 'Timeline'}
                    preview={timelineSVG}
                    callback={(val): void => updateChoice(val)}
                    className="display-wrapper__display-card"
                />
            </div>
        </div>
    )
}

export default DashboardPickerTab
