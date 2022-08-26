import React, { useState, useEffect } from 'react'

import { useRouteMatch } from 'react-router'

import { Heading2, Heading3, Paragraph } from '@entur/typography'

import { FloatingButton } from '@entur/button'

import { AddIcon, SubtractIcon } from '@entur/icons'

import { useSettingsContext } from '../../../settings'
import {
    saveToLocalStorage,
    getFromLocalStorage,
} from '../../../settings/LocalStorage'

import { Direction, Theme } from '../../../types'
import RadioCard from '../../../components/RadioCard'
import Grey from '../../../assets/previews/Grey-theme.svg'
import Dark from '../../../assets/previews/Dark-theme.svg'
import Light from '../../../assets/previews/Light-theme.svg'
import Entur from '../../../assets/previews/Entur-theme.svg'
import { getDocumentId } from '../../../utils'

import { DirectionPreview } from '../../../assets/icons/DirectionPreview'

import './styles.scss'

const ThemeTab = (): JSX.Element => {
    const [radioValue, setRadioValue] = useState<Theme | null>(null)
    const [settings, setSettings] = useSettingsContext()
    const documentId = getDocumentId()
    const boardId = useRouteMatch<{ documentId: string }>('/admin/:documentId')
        ?.params?.documentId

    const direction = getFromLocalStorage(boardId + '-direction') as Direction

    const [rotationRadioValue, setRotationRadioValue] = useState<Direction>(
        direction || Direction.STANDARD,
    )

    const directionPreviewImages = DirectionPreview(settings?.theme)

    const [fontScale, setFontScale] = useState(
        getFromLocalStorage(boardId + '-fontScale') || 1,
    )

    useEffect(() => {
        if (settings?.theme && !radioValue) {
            setRadioValue(settings.theme)
        }
    }, [settings, radioValue])

    const switchTheme = (value: Theme): void => {
        setRadioValue(value)
        setSettings({
            theme: value,
        })
    }

    const switchDirection = (value: Direction): void => {
        setRotationRadioValue(value)
        setSettings({
            direction: value,
        })
        onChangeDirection(value)
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

    enum eFontChangeAction {
        increase = 1,
        decrease,
    }

    function onChangeFontSize(action: eFontChangeAction) {
        let newFontScale = fontScale

        switch (action) {
            case eFontChangeAction.increase:
                newFontScale += 0.5
                break

            case eFontChangeAction.decrease:
                newFontScale = newFontScale - 0.5 || 0.5
                break

            default:
                break
        }

        setFontScale(newFontScale)
        saveToLocalStorage(boardId + '-fontScale', newFontScale)
    }

    function onChangeDirection(dashboardDirection: Direction) {
        saveToLocalStorage(boardId + '-direction', dashboardDirection)
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
                    selected={radioValue === 'default'}
                    callback={(val): void => switchTheme(val as Theme)}
                    className="theme-tab__theme-card"
                />
                <RadioCard
                    title="Mørkt"
                    cardValue="dark"
                    preview={Dark}
                    selected={radioValue === 'dark'}
                    callback={(val): void => switchTheme(val as Theme)}
                    className="theme-tab__theme-card"
                />
                <RadioCard
                    title="Lyst"
                    cardValue="light"
                    preview={Light}
                    selected={radioValue === 'light'}
                    callback={(val): void => switchTheme(val as Theme)}
                    className="theme-tab__theme-card"
                />
                <RadioCard
                    title="Grått"
                    cardValue="grey"
                    preview={Grey}
                    selected={radioValue === 'grey'}
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
                        cardValue="standard"
                        preview={directionPreviewImages.Standard}
                        selected={rotationRadioValue === 'standard'}
                        callback={(val): void =>
                            switchDirection(val as Direction)
                        }
                        className="theme-tab__theme-card"
                    />
                    <RadioCard
                        title="Rotert"
                        cardValue="rotert"
                        preview={directionPreviewImages.Rotated}
                        selected={rotationRadioValue === 'rotert'}
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
                            onChangeFontSize(eFontChangeAction.decrease)
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
                            onChangeFontSize(eFontChangeAction.increase)
                        }
                        className="theme-tab__font-size-button"
                        aria-label="Større"
                    >
                        Større
                        <AddIcon />
                    </FloatingButton>
                </div>
            </div>
        </div>
    )
}

export default ThemeTab
