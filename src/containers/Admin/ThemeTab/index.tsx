import React, { useState, useEffect } from 'react'

import { Heading2, Heading3, Label, Paragraph } from '@entur/typography'

import { useSettingsContext } from '../../../settings'
import {
    saveToLocalStorage,
    getFromLocalStorage,
} from '../../../settings/LocalStorage'

import {
    Direction,
    LineData,
    NonEmpty,
    StopPlaceWithDepartures,
    Theme,
} from '../../../types'
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
import { FloatingButton, PrimaryButton } from '@entur/button'
import { AddIcon, SubtractIcon } from '@entur/icons'
import { useRouteMatch } from 'react-router'
import DepartureTile from '../../../dashboards/Compact/DepartureTile'
import { useStopPlacesWithDepartures } from '../../../logic'
import { Line, TransportMode } from '@entur/sdk/lib/journeyPlanner/types'
import { RadioGroup, RadioPanel } from '@entur/form'
import { fovyToAltitude } from '@math.gl/web-mercator/src/web-mercator-utils'

const ThemeTab = (): JSX.Element => {
    const [radioValue, setRadioValue] = useState<Theme | null>(null)
    const [settings, setSettings] = useSettingsContext()
    const documentId = getDocumentId()
    const boardId = useRouteMatch<{ documentId: string }>('/admin/:documentId')
        ?.params?.documentId

    const direction = getFromLocalStorage(boardId + '-direction') as Direction

    const [rotationRadioValue, setRotationRadioValue] =
        useState<Direction | null>(direction || Direction.STANDARD)

    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    const [stopPlaceExample, setStopPlaceExample] =
        useState<StopPlaceWithDepartures>()

    useEffect(() => {
        const previewStopPlace =
            stopPlacesWithDepartures && stopPlacesWithDepartures[0]
        if (previewStopPlace) {
            const { departures } = previewStopPlace
            const groupedDepartures = groupBy<LineData>(departures, 'route')
            const routes = Object.keys(groupedDepartures)[0]
            if (departures && routes) {
                const myDepartures = groupedDepartures[
                    routes
                ] as NonEmpty<LineData>
                setStopPlaceExample({
                    ...previewStopPlace,
                    departures: myDepartures,
                })
            }
        }
    }, [stopPlacesWithDepartures])


    const [fontScale, setFontScale] = useState(
        getFromLocalStorage(boardId + '-fontScale') || 1,
    )

    const [value, setValue] = useState(
        getFromLocalStorage(boardId + '-fontScale') || "Liten",
    )

    //const baseFontSize = 16

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

    console.log(getFromLocalStorage(boardId + '-fontScale'))

    function onChangeFontSize(fontScale: string) {
        saveToLocalStorage(boardId + '-fontScale', fontScale)

        switch (fontScale) {
            case "0.5":
                setFontScale(0.5)
                break

            case "1":
                setFontScale(1)
                break

            case "1.5":
                setFontScale(1.5)
                break

            case "2":
                setFontScale(2.5)
                break
            
            case "3":
                setFontScale(3.5)
                break

            default:
                break
        }

    }



    function onChangeDirection(direction: Direction) {
        saveToLocalStorage(boardId + '-direction', direction)
        /* switch(direction){
            case Direction.STANDARD:
                newFontScale += 0.5
                break

            case Direction.ROTERT:
                newFontScale = (newFontScale - 0.5) || 0.5
                break
            
            default:
                break
        } */
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
            {/* <div className='theme-tab__grid'> */}
            <div>
                <Heading3 className="heading">Velg tekststørrelse</Heading3>
                <Paragraph className="theme-tab__paragraph">
                    Her kan du velge hvor stor teksten på tavla skal være.
                    Teksten vil kun gjelde for den samme nettleseren du endrer
                    innstillingen på.
                </Paragraph>

                <div>
                    <RadioGroup
                        name="ticket-type"
                        value={value} 
                        onChange={ e => {setValue(e.target.value); onChangeFontSize(e.target.value)}}>
                    <div style={{ display: 'grid', gridGap: '0.5rem', alignItems: "center", gridTemplateColumns: "repeat(auto-fill, minmax(10rem, 0.5fr))"}}>
                        <RadioPanel style = {{minWidth: "10rem", maxWidth: "12rem"}} title="Ekstra liten" value="0.5" size="medium" />
                        <RadioPanel style = {{minWidth: "10rem", maxWidth: "12rem"}} title="Liten" value="1" size="medium"/>
                        <RadioPanel style = {{minWidth: "10rem", maxWidth: "12rem"}} title="Vanlig" value="1.5" size="medium"/>
                        <RadioPanel style = {{minWidth: "10rem", maxWidth: "12rem"}} title="Stor" value="2" size="medium"/>
                        <RadioPanel style = {{minWidth: "10rem", maxWidth: "12rem"}} title="Ekstra stor" value="2.5" size="medium"/>
                    </div>
                    </RadioGroup>
                </div>
                
                {/*  <div className="chrono" style={{fontSize:fontScale*baseFontSize}}>
                        {stopPlaceExample && <DepartureTile stopPlaceWithDepartures={stopPlaceExample} />}
                        </div> */}
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
                        preview={Standard}
                        selected={rotationRadioValue === 'standard'}
                        callback={(val): void =>
                            switchDirection(val as Direction)
                        }
                        className="theme-tab__theme-card"
                    />
                    <RadioCard
                        title="Rotert"
                        cardValue="rotert"
                        preview={Rotert}
                        selected={rotationRadioValue === 'rotert'}
                        callback={(val): void =>
                            switchDirection(val as Direction)
                        }
                        className="theme-tab__theme-card"
                    />
                </div>
            </div>
            {/* </div> */}
        </div>
    )
}

export default ThemeTab
