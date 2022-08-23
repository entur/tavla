import React, { useState, useEffect } from 'react'

import { Heading2, Heading3, Paragraph } from '@entur/typography'

import { useSettingsContext,  } from '../../../settings'
import { saveToLocalStorage, getFromLocalStorage } from '../../../settings/LocalStorage'

import { Direction, LineData, NonEmpty, StopPlaceWithDepartures, Theme } from '../../../types'
import RadioCard from '../../../components/RadioCard'
import Grey from '../../../assets/previews/Grey-theme.svg'
import Dark from '../../../assets/previews/Dark-theme.svg'
import Light from '../../../assets/previews/Light-theme.svg'
import Entur from '../../../assets/previews/Entur-theme.svg'
import Standard from '../../../assets/previews/standard.svg'
import Rotert from '../../../assets/previews/rotert.svg'
import { getDocumentId, groupBy } from '../../../utils'

import './styles.scss'
import './../../../dashboards/Chrono/styles.scss'
import { FloatingButton } from '@entur/button'
import { AddIcon, SubtractIcon } from '@entur/icons'
import { useRouteMatch } from 'react-router'
import { useStopPlacesWithDepartures } from '../../../logic'

const ThemeTab = (): JSX.Element => {
    const [radioValue, setRadioValue] = useState<Theme | null>(null)
    const [settings, setSettings] = useSettingsContext()
    const documentId = getDocumentId()
    const boardId = useRouteMatch<{ documentId: string }>('/admin/:documentId')?.params?.documentId

    const direction = getFromLocalStorage(boardId + "-direction") as Direction

    const [rotationRadioValue, setRotationRadioValue] = useState<Direction | null>(direction || Direction.STANDARD)


    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const [stopPlaceExample, setStopPlaceExample] = useState<StopPlaceWithDepartures>()

    useEffect(() => {
        const previewStopPlace = stopPlacesWithDepartures && stopPlacesWithDepartures[0]
        if(previewStopPlace){
            const {departures} = previewStopPlace
            const groupedDepartures = groupBy<LineData>(departures, 'route')
            const routes = Object.keys(groupedDepartures)[0]
            if(departures && routes){
                const myDepartures = groupedDepartures[routes] as NonEmpty<LineData>
                setStopPlaceExample({...previewStopPlace, departures: myDepartures})
            }
        }
    }, [stopPlacesWithDepartures])



    
    const [fontScale, setFontScale] = useState(getFromLocalStorage(boardId + "-fontScale") || 1)

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

        console.log("direction value???", value)
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
        decrease
    }


    function onChangeFontSize(action: eFontChangeAction) {
        let newFontScale = fontScale

        switch(action){
            case eFontChangeAction.increase:
                newFontScale += 0.5
                break

            case eFontChangeAction.decrease:
                newFontScale = (newFontScale - 0.5) || 0.5
                break
            
            default:
                break
        }


        setFontScale(newFontScale)
        saveToLocalStorage(boardId + "-fontScale", newFontScale)
    }

    function onChangeDirection(direction: Direction){
        saveToLocalStorage(boardId + "-direction", direction)
    }

    return (
        <div>
            <Heading2 className="heading">
                Tilpass utseende
            </Heading2>
            <Heading3 className="heading">Velg farger</Heading3>
            <div className="theme-tab">
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
                <div className="sizeAndDirection" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem" }}>
                    <div style={{display: "flex", flexDirection: "column", width: "fit-content"}}>
                    <div><Heading3 className="heading">Velg tekststørrelse</Heading3></div>
                    <Paragraph className="logo-page__paragraph">
                    Her kan du velge hvor stor teksten på tavla skal være. Teksten vil kun gjelde for den samme nettleseren du endrer innstillingen på.
                        </Paragraph>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                        <FloatingButton onClick={() => onChangeFontSize(eFontChangeAction.decrease)} style={{width: "11rem", minWidth: "8rem"}} aria-label="Mindre">Mindre<SubtractIcon/></FloatingButton>
                        <span style={{margin: "2rem"}}>{fontScale*100}%</span>
                        <FloatingButton onClick={() => onChangeFontSize(eFontChangeAction.increase)} style={{width: "11rem", minWidth: "8rem"}} aria-label="Større">Større<AddIcon/></FloatingButton>
                    </div>
                    </div>
                    <div>
                        <Heading3 className="heading">Velg retning</Heading3>
                        <Paragraph className="logo-page__paragraph">
                            Her kan du velge hvilken retning innholdet på tavla skal vises.
                            <div style={{display: 'flex', flexDirection: "row"}}>
                            <RadioCard
                                title="Standard"
                                cardValue="standard"
                                preview={Standard}
                                selected={rotationRadioValue === 'standard'}
                                callback={(val): void => switchDirection(val as Direction)}
                                className="theme-tab__theme-card"
                            />
                            <RadioCard
                                title="Rotert"
                                cardValue="rotert"
                                preview={Rotert}
                                selected={rotationRadioValue === 'rotert'}
                                callback={(val): void => switchDirection(val as Direction)}
                                className="theme-tab__theme-card"
                            />
                            </div>
                        </Paragraph>
                    </div>
            </div>
        </div>
    )

}

export default ThemeTab
