import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Heading2, Heading3, Paragraph } from '@entur/typography'
import { FloatingButton } from '@entur/button'
import { AddIcon, SubtractIcon } from '@entur/icons'
import { useSettings } from '../../../settings/SettingsProvider'
import { Direction, Theme, FontChangeAction } from '../../../types'
import { RadioCard } from '../../../components/RadioCard/RadioCard'
import Grey from '../../../assets/previews/Grey-theme.svg'
import Dark from '../../../assets/previews/Dark-theme.svg'
import Light from '../../../assets/previews/Light-theme.svg'
import Entur from '../../../assets/previews/Entur-theme.svg'
import { DirectionPreview } from '../../../assets/icons/DirectionPreview'
import './ThemeTab.scss'
import { FontSizePreview } from './FontSizePreview/FontSizePreview'

const ThemeTab = (): JSX.Element => {
    const [settings, setSettings] = useSettings()
    const [themeRadioValue, setThemeRadioValue] = useState<Theme | null>(null)
    const [fontScale, setFontScale] = useState<number>(settings.fontScale)
    const [directionRadioValue, setDirectionRadioValue] = useState<Direction>(
        settings.direction,
    )
    const { documentId } = useParams<{ documentId: string }>()
    const directionPreviewImages = DirectionPreview(settings.theme)

    useEffect(() => {
        if (settings.theme && !themeRadioValue) {
            setThemeRadioValue(settings.theme)
        }
    }, [settings, themeRadioValue])

    const switchTheme = (value: Theme): void => {
        setThemeRadioValue(value)
        setSettings({
            theme: value,
        })
    }

    const switchDirection = (value: Direction): void => {
        setDirectionRadioValue(value)
        setSettings({
            direction: value,
        })
    }

    function changeFontSize(action: FontChangeAction) {
        let newFontScale = fontScale

        switch (action) {
            case FontChangeAction.increase:
                newFontScale += 0.5
                break

            case FontChangeAction.decrease:
                newFontScale = newFontScale - 0.5 || 0.5
                break

            default:
                break
        }

        setFontScale(newFontScale)
        setSettings({
            fontScale: newFontScale,
        })
    }

    if (!documentId) {
        return (
            <div className="legacy-theme-tab">
                <Heading2 className="heading">Velg farger</Heading2>
                <Paragraph className="legacy-theme-tab__eds-paragraph">
                    Vi har oppgradert tavla. Ønsker du tilgang på denne
                    funksjonaliteten må du lage en ny tavle.
                </Paragraph>
            </div>
        )
    }

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
                    value="default"
                    preview={Entur}
                    selected={themeRadioValue === 'default'}
                    onChange={(val): void => switchTheme(val as Theme)}
                    className="theme-tab__theme-card"
                    altText="Bilde av forhåndsvisning av standard fargevisning"
                />
                <RadioCard
                    title="Mørkt"
                    value="dark"
                    preview={Dark}
                    selected={themeRadioValue === 'dark'}
                    onChange={(val): void => switchTheme(val as Theme)}
                    className="theme-tab__theme-card"
                    altText="Bilde av forhåndsvisning av mørk fargevisning"
                />
                <RadioCard
                    title="Lyst"
                    value="light"
                    preview={Light}
                    selected={themeRadioValue === 'light'}
                    onChange={(val): void => switchTheme(val as Theme)}
                    className="theme-tab__theme-card"
                    altText="Bilde av forhåndsvisning av lys fargevisning"
                />
                <RadioCard
                    title="Grått"
                    value="grey"
                    preview={Grey}
                    selected={themeRadioValue === 'grey'}
                    onChange={(val): void => switchTheme(val as Theme)}
                    className="theme-tab__theme-card"
                    altText="Bilde av forhåndsvisning av grå fargevisning"
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
                        selected={directionRadioValue === Direction.STANDARD}
                        onChange={(val): void =>
                            switchDirection(val as Direction)
                        }
                        className="theme-tab__theme-card"
                    />
                    <RadioCard
                        title="Rotert"
                        value={Direction.ROTATED}
                        preview={directionPreviewImages.Rotated}
                        selected={directionRadioValue === Direction.ROTATED}
                        onChange={(val): void =>
                            switchDirection(val as Direction)
                        }
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
                            changeFontSize(FontChangeAction.decrease)
                        }
                        className="theme-tab__font-size-button"
                        aria-label="Mindre"
                    >
                        Mindre
                        <SubtractIcon />
                    </FloatingButton>
                    <span className="theme-tab__font-size-percentage">
                        {fontScale * 100}%
                    </span>
                    <FloatingButton
                        onClick={() =>
                            changeFontSize(FontChangeAction.increase)
                        }
                        className="theme-tab__font-size-button"
                        aria-label="Større"
                    >
                        Større
                        <AddIcon />
                    </FloatingButton>
                </div>
                <FontSizePreview fontScale={fontScale} />
            </div>
        </div>
    )
}

export { ThemeTab }
