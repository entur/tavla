import React, { useState, useEffect } from 'react'

import { Heading2, Heading3, Paragraph } from '@entur/typography'

import { FloatingButton } from '@entur/button'

import { AddIcon, SubtractIcon } from '@entur/icons'

import { useSettingsContext } from '../../../settings'

import { Direction, Theme, FontChangeAction } from '../../../types'
import RadioCard from '../../../components/RadioCard'
import Grey from '../../../assets/previews/Grey-theme.svg'
import Dark from '../../../assets/previews/Dark-theme.svg'
import Light from '../../../assets/previews/Light-theme.svg'
import Entur from '../../../assets/previews/Entur-theme.svg'
import { getDocumentId } from '../../../utils'

import { DirectionPreview } from '../../../assets/icons/DirectionPreview'

import './styles.scss'

import FontSizePreview from './FontSizePreview'

const ThemeTab = (): JSX.Element => {
    const [settings, setSettings] = useSettingsContext()
    const [themeRadioValue, setThemeRadioValue] = useState<Theme | null>(null)
    const [fontScale, setFontScale] = useState<number>(settings?.fontScale || 1)
    const [directionRadioValue, setDirectionRadioValue] = useState<Direction>(
        settings?.direction || Direction.STANDARD,
    )
    const documentId = getDocumentId()
    const directionPreviewImages = DirectionPreview(settings?.theme)

    useEffect(() => {
        if (settings?.theme && !themeRadioValue) {
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
                    cardValue="default"
                    preview={Entur}
                    selected={themeRadioValue === 'default'}
                    callback={(val): void => switchTheme(val as Theme)}
                    className="theme-tab__theme-card"
                />
                <RadioCard
                    title="Mørkt"
                    cardValue="dark"
                    preview={Dark}
                    selected={themeRadioValue === 'dark'}
                    callback={(val): void => switchTheme(val as Theme)}
                    className="theme-tab__theme-card"
                />
                <RadioCard
                    title="Lyst"
                    cardValue="light"
                    preview={Light}
                    selected={themeRadioValue === 'light'}
                    callback={(val): void => switchTheme(val as Theme)}
                    className="theme-tab__theme-card"
                />
                <RadioCard
                    title="Grått"
                    cardValue="grey"
                    preview={Grey}
                    selected={themeRadioValue === 'grey'}
                    callback={(val): void => switchTheme(val as Theme)}
                    className="theme-tab__theme-card"
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
                        cardValue={Direction.STANDARD}
                        preview={directionPreviewImages.Standard}
                        selected={directionRadioValue === Direction.STANDARD}
                        callback={(val): void =>
                            switchDirection(val as Direction)
                        }
                        className="theme-tab__theme-card"
                    />
                    <RadioCard
                        title="Rotert"
                        cardValue={Direction.ROTATED}
                        preview={directionPreviewImages.Rotated}
                        selected={directionRadioValue === Direction.ROTATED}
                        callback={(val): void =>
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

export default ThemeTab
