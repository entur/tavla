import React, { useCallback, useState } from 'react'
import { Heading2 } from '@entur/typography'
import { RadioCard } from '../../../components/RadioCard/RadioCard'
import { useSettings } from '../../../settings/SettingsProvider'
import { DashboardTypes } from '../../../types'
import { ThemeDashboardPreview } from '../../../assets/icons/ThemeDashboardPreview'
import './DashboardPickerTab.scss'

const DashboardPickerTab = (): JSX.Element => {
    const [settings, setSettings] = useSettings()
    const dashboardImages = ThemeDashboardPreview(settings?.theme)

    const [radioValue, setRadioValue] = useState<DashboardTypes>(
        settings?.dashboard || DashboardTypes.Compact,
    )

    const updateChoice = useCallback(
        (value: DashboardTypes) => {
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
                    value={DashboardTypes.Compact}
                    selected={radioValue === DashboardTypes.Compact}
                    preview={dashboardImages.Compact}
                    onChange={updateChoice}
                    className="display-wrapper__display-card"
                />
                <RadioCard
                    title="Kronologisk"
                    description="Avgangene vises i en kronologisk rekkefølge. Egner seg godt for linjer som varierer spor/plattform."
                    value={DashboardTypes.Chrono}
                    selected={radioValue === DashboardTypes.Chrono}
                    preview={dashboardImages.Chrono}
                    onChange={updateChoice}
                    className="display-wrapper__display-card"
                />
                <RadioCard
                    title="Tidslinje"
                    description="Avgangene vises i en visualisert fremstilling. Viser ikke bysykkel, spor/plattform eller avvik."
                    value={DashboardTypes.Timeline}
                    selected={radioValue === DashboardTypes.Timeline}
                    preview={dashboardImages.Timeline}
                    onChange={updateChoice}
                    className="display-wrapper__display-card"
                />
                <RadioCard
                    title="Kart"
                    description="Avgangene vises i visualisert i et kart. Viser ikke Sparkesykler, spor/platform eller avvik."
                    value={DashboardTypes.Map}
                    selected={radioValue === DashboardTypes.Map}
                    preview={dashboardImages.Map}
                    onChange={updateChoice}
                    className="display-wrapper__display-card"
                />
                <RadioCard
                    title="Holdeplass"
                    description="Her får avgangene full bredde med god plass til å vise avviksmeldinger. Egner seg godt for når man er interessert i ett eller få stopp."
                    value={DashboardTypes.BusStop}
                    selected={radioValue === DashboardTypes.BusStop}
                    preview={dashboardImages.BusStop}
                    onChange={updateChoice}
                    className="display-wrapper__display-card"
                />
            </div>
        </div>
    )
}

export { DashboardPickerTab }
