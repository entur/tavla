import React, { useState, useCallback, useEffect } from 'react'
import { Heading2 } from '@entur/typography'

import './styles.scss'

import RadioCard from '../../../components/RadioCard'
import CompactDark from '../../../assets/previews/previewDark/Kompakt-dark.svg'
import ChronoDark from '../../../assets/previews/previewDark/Kronologisk-dark.svg'
import TimelineDark from '../../../assets/previews/previewDark/Tidslinje-dark.svg'
import CompactLight from '../../../assets/previews/previewLight/Kompakt-light.svg'
import ChronoLight from '../../../assets/previews/previewLight/Kronologisk-light.svg'
import TimelineLight from '../../../assets/previews/previewLight/Tidslinje-light.svg'
import CompactDefault from '../../../assets/previews/previewDefault/Kompakt-blue.svg'
import ChronoDefault from '../../../assets/previews/previewDefault/Kronologisk-blue.svg'
import TimelineDefault from '../../../assets/previews/previewDefault/Tidslinje-blue.svg'
import CompactGrey from '../../../assets/previews/previewGrey/Kompakt-grey.svg'
import ChronoGrey from '../../../assets/previews/previewGrey/Kronologisk-grey.svg'
import TimelineGrey from '../../../assets/previews/previewGrey/Tidslinje-grey.svg'

import { useSettingsContext } from '../../../settings'
import { Theme } from '../../../types'

const DashboardPickerTab = (): JSX.Element => {
    const [settings, { setDashboard }] = useSettingsContext()
    const [compactSVG, setCompactSVG] = useState(CompactDefault)
    const [chronoSVG, setChronoSVG] = useState(ChronoDefault)
    const [timelineSVG, setTimelineSVG] = useState(TimelineDefault)

    useEffect(() => {
        switch (settings?.theme) {
            case Theme.DARK:
                setChronoSVG(ChronoDark)
                setCompactSVG(CompactDark)
                setTimelineSVG(TimelineDark)
                break
            case Theme.LIGHT:
                setChronoSVG(ChronoLight)
                setCompactSVG(CompactLight)
                setTimelineSVG(TimelineLight)
                break
            case Theme.GREY:
                setChronoSVG(ChronoGrey)
                setCompactSVG(CompactGrey)
                setTimelineSVG(TimelineGrey)
                break
            default:
                setChronoSVG(ChronoDefault)
                setCompactSVG(CompactDefault)
                setTimelineSVG(TimelineDefault)
        }
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
