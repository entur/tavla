import React, { useCallback } from 'react'
import { RadioCard } from 'components/RadioCard/RadioCard'
import { useSettings } from 'settings/SettingsProvider'
import { DashboardTypes } from 'src/types'
import { ThemeDashboardPreview } from 'assets/icons/ThemeDashboardPreview'
import { Heading2 } from '@entur/typography'
import classes from './DashboardPickerTab.module.scss'

const DashboardPickerTab = (): JSX.Element => {
    const [settings, setSettings] = useSettings()
    const dashboardImages = ThemeDashboardPreview(settings.theme)

    const handleChange = useCallback(
        (value: DashboardTypes) => {
            setSettings({
                dashboard: value,
            })
        },
        [setSettings],
    )

    return (
        <div>
            <Heading2 className={classes.Heading}>Velg visning</Heading2>
            <div className={classes.DisplayWrapper}>
                <RadioCard
                    title="Kompakt (standard)"
                    description="Alle avgangene til en linje vises på en samlet rad. Ikke egnet for linjer som varierer spor/plattform."
                    value={DashboardTypes.Compact}
                    selected={settings.dashboard === DashboardTypes.Compact}
                    preview={dashboardImages.Compact}
                    onChange={handleChange}
                    className={classes.DisplayCard}
                    altText=""
                />
                <RadioCard
                    title="Kronologisk"
                    description="Avgangene vises i en kronologisk rekkefølge. Egner seg godt for linjer som varierer spor/plattform."
                    value={DashboardTypes.Chrono}
                    selected={settings.dashboard === DashboardTypes.Chrono}
                    preview={dashboardImages.Chrono}
                    onChange={handleChange}
                    className={classes.DisplayCard}
                    altText=""
                />
                <RadioCard
                    title="Holdeplass"
                    description="Her får avgangene full bredde med god plass til å vise avviksmeldinger. Egner seg godt for når man er interessert i ett eller få stopp."
                    value={DashboardTypes.BusStop}
                    selected={settings.dashboard === DashboardTypes.BusStop}
                    preview={dashboardImages.BusStop}
                    onChange={handleChange}
                    className={classes.DisplayCard}
                    altText=""
                />
                <RadioCard
                    title="Responsiv"
                    description="Avgangene fyller ut skjermen automatisk i et rutenett basert på skjermstørrelse. Denne visningen, kombinert med tekststørrelse-instillingen i Tilpass Utseende fanen, egner seg for skjermer av ulike størrelser."
                    value={DashboardTypes.Responsive}
                    selected={settings.dashboard === DashboardTypes.Responsive}
                    preview={dashboardImages.Chrono}
                    onChange={handleChange}
                    className={classes.DisplayCard}
                    altText=""
                />
                <RadioCard
                    title="Tidslinje"
                    description="Avgangene vises i en visualisert fremstilling. Viser ikke bysykkel, spor/plattform eller avvik."
                    value={DashboardTypes.Timeline}
                    selected={settings.dashboard === DashboardTypes.Timeline}
                    preview={dashboardImages.Timeline}
                    onChange={handleChange}
                    className={classes.DisplayCard}
                    altText=""
                />
                <RadioCard
                    title="Kart"
                    description="Avgangene vises i et kart."
                    value={DashboardTypes.Map}
                    selected={settings.dashboard === DashboardTypes.Map}
                    preview={dashboardImages.Map}
                    onChange={handleChange}
                    className={classes.DisplayCard}
                    altText=""
                />
                <RadioCard
                    title="Holdeplass"
                    description="Her får avgangene full bredde med god plass til å vise avviksmeldinger. Egner seg godt for når man er interessert i ett eller få stopp."
                    value={DashboardTypes.BusStop}
                    selected={settings.dashboard === DashboardTypes.BusStop}
                    preview={dashboardImages.BusStop}
                    onChange={handleChange}
                    className={classes.DisplayCard}
                    altText=""
                />
                <RadioCard
                    title="Ny Holdeplassvisning"
                    description="....."
                    value={DashboardTypes.NewBusStop}
                    selected={settings.dashboard === DashboardTypes.NewBusStop}
                    preview={dashboardImages.BusStop}
                    onChange={handleChange}
                    className={classes.DisplayCard}
                    altText=""
                />
            </div>
        </div>
    )
}

export { DashboardPickerTab }
