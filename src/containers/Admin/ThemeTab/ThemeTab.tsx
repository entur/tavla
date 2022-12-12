import React, { useCallback } from 'react'
import { Heading2, Heading3, Paragraph } from '@entur/typography'
import { FloatingButton } from '@entur/button'
import { AddIcon, SubtractIcon } from '@entur/icons'
import { useSettings } from '../../../settings/SettingsProvider'
import { Direction, FontChangeAction, Theme } from '../../../types'
import { RadioCard } from '../../../components/RadioCard/RadioCard'
import Grey from '../../../assets/previews/Grey-theme.svg'
import Dark from '../../../assets/previews/Dark-theme.svg'
import Light from '../../../assets/previews/Light-theme.svg'
import Entur from '../../../assets/previews/Entur-theme.svg'
import { DirectionPreview } from '../../../assets/icons/DirectionPreview'
import { FontSizePreview } from './FontSizePreview/FontSizePreview'
import './ThemeTab.scss'

const SCALE_STEP = 0.1

const ThemeTab = (): JSX.Element => {
    const [settings, setSettings] = useSettings()
    const directionPreviewImages = DirectionPreview(settings.theme)

    const handleSwitchTheme = useCallback(
        (value: Theme): void => {
            setSettings({
                theme: value,
            })
        },
        [setSettings],
    )

    const handleSwitchDirection = useCallback(
        (value: Direction): void => {
            setSettings({
                direction: value,
            })
        },
        [setSettings],
    )

    const handleChangeFontSize = useCallback(
        (action: FontChangeAction) => {
            let newFontScale = settings.fontScale

            switch (action) {
                case FontChangeAction.increase:
                    newFontScale += SCALE_STEP
                    break

                case FontChangeAction.decrease:
                    newFontScale = newFontScale - SCALE_STEP || SCALE_STEP
                    break
            }

            setSettings({
                fontScale: newFontScale,
            })
        },
        [settings, setSettings],
    )

    return (
        <div className="theme-tab">
            <Heading2 className="heading">Tilpass utseende</Heading2>
            <Paragraph className="theme-tab__paragraph">
                Her kan du endre utseendet på tavlen din. Vær oppmerksom på at
                tekststørrelse og rotasjon kun vil vises på selve tavla, og ikke
                på siden hvor du endrer på instillingene. Fargene vil
                reflekteres både på tavla og i instillingene.
            </Paragraph>
            <Heading3 className="heading">Velg farger</Heading3>
            <div className="theme-tab__grid">
                <RadioCard
                    title="Entur (standard)"
                    value={Theme.DEFAULT}
                    preview={Entur}
                    selected={settings.theme === Theme.DEFAULT}
                    onChange={handleSwitchTheme}
                    className="theme-tab__theme-card"
                    altText=""
                />
                <RadioCard
                    title="Mørkt"
                    value={Theme.DARK}
                    preview={Dark}
                    selected={settings.theme === Theme.DARK}
                    onChange={handleSwitchTheme}
                    className="theme-tab__theme-card"
                    altText=""
                />
                <RadioCard
                    title="Lyst"
                    value={Theme.LIGHT}
                    preview={Light}
                    selected={settings.theme === Theme.LIGHT}
                    onChange={handleSwitchTheme}
                    className="theme-tab__theme-card"
                    altText=""
                />
                <RadioCard
                    title="Grått"
                    value={Theme.GREY}
                    preview={Grey}
                    selected={settings.theme === Theme.GREY}
                    onChange={handleSwitchTheme}
                    className="theme-tab__theme-card"
                    altText=""
                />
            </div>
            <div>
                <Heading3 className="heading">Velg rotasjon</Heading3>
                <Paragraph className="theme-tab__paragraph">
                    Her kan du velge hvilken retning innholdet på tavla skal
                    vises.
                </Paragraph>
                <div className="theme-tab__grid">
                    <RadioCard
                        title="Standard"
                        value={Direction.STANDARD}
                        preview={directionPreviewImages.Standard}
                        selected={settings.direction === Direction.STANDARD}
                        onChange={handleSwitchDirection}
                        className="theme-tab__theme-card"
                    />
                    <RadioCard
                        title="Rotert"
                        value={Direction.ROTATED}
                        preview={directionPreviewImages.Rotated}
                        selected={settings.direction === Direction.ROTATED}
                        onChange={handleSwitchDirection}
                        className="theme-tab__theme-card"
                    />
                </div>
            </div>
            <div>
                <Heading3 className="heading">Velg tekststørrelse</Heading3>
                <Paragraph className="theme-tab__paragraph">
                    Her kan du velge hvor stor teksten på tavla skal være.
                    Teksten vil kun gjelde for den samme nettleseren du endrer
                    innstillingen på.
                </Paragraph>
                <div className="theme-tab__font-size-buttons">
                    <FloatingButton
                        onClick={() =>
                            handleChangeFontSize(FontChangeAction.decrease)
                        }
                        className="theme-tab__font-size-button"
                        aria-label="Mindre"
                    >
                        Mindre
                        <SubtractIcon />
                    </FloatingButton>
                    <span className="theme-tab__font-size-percentage">
                        {Math.round(settings.fontScale * 100)}%
                    </span>
                    <FloatingButton
                        onClick={() =>
                            handleChangeFontSize(FontChangeAction.increase)
                        }
                        className="theme-tab__font-size-button"
                        aria-label="Større"
                    >
                        Større
                        <AddIcon />
                    </FloatingButton>
                </div>
                <FontSizePreview fontScale={settings.fontScale} />
            </div>
        </div>
    )
}

export { ThemeTab }
