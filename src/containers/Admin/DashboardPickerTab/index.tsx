import React, { useState, useCallback } from 'react'

import { Heading2 } from '@entur/typography'

import RadioCard from '../../../components/RadioCard'

import { useSettingsContext } from '../../../settings'
import { ThemeDashboardPreview } from '../../../assets/icons/ThemeDashboardPreview'

import './styles.scss'

const DashboardPickerTab = (): JSX.Element => {
    const [settings, setSettings] = useSettingsContext()
    const dashboardImages = ThemeDashboardPreview(settings?.theme)

    const [radioValue, setRadioValue] = useState<string>(
        settings?.dashboard || 'Compact',
    )

    const updateChoice = useCallback(
        (value: string) => {
            if (value != radioValue) {
                setRadioValue(value)
                setSettings({
                    dashboard: value,
                })
            }
        },
        [radioValue, setRadioValue, setSettings],
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
                    preview={dashboardImages.Compact}
                    callback={(val): void => updateChoice(val)}
                    className="display-wrapper__display-card"
                />
                <RadioCard
                    title="Kronologisk"
                    description="Avgangene vises i en kronologisk rekkefølge. Egner seg godt for linjer som varierer spor/plattform."
                    cardValue="Chrono"
                    selected={radioValue === 'Chrono'}
                    preview={dashboardImages.Chrono}
                    callback={(val): void => updateChoice(val)}
                    className="display-wrapper__display-card"
                />
                <RadioCard
                    title="Tidslinje"
                    description="Avgangene vises i en visualisert fremstilling. Viser ikke bysykkel, spor/plattform eller avvik."
                    cardValue="Timeline"
                    selected={radioValue === 'Timeline'}
                    preview={dashboardImages.Timeline}
                    callback={(val): void => updateChoice(val)}
                    className="display-wrapper__display-card"
                />
                <RadioCard
                    title="Kart"
                    description="Avgangene vises i visualisert i et kart. Viser ikke Sparkesykler, spor/platform eller avvik."
                    cardValue="Map"
                    selected={radioValue === 'Map'}
                    preview={dashboardImages.Map}
                    callback={(val): void => updateChoice(val)}
                    className="display-wrapper__display-card"
                />
                <RadioCard
                    title="Holdeplass"
                    description="Her får avgangene full bredde med god plass til å vise avviksmeldinger. Egner seg godt for når man er interessert i ett eller få stopp."
                    cardValue="BusStop"
                    selected={radioValue === 'BusStop'}
                    preview={dashboardImages.BusStop}
                    callback={(val): void => updateChoice(val)}
                    className="display-wrapper__display-card"
                />
            </div>
        </div>
    )
}

export default DashboardPickerTab
