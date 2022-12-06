import React, {
    useState,
    useMemo,
    useEffect,
    useCallback,
    SyntheticEvent,
} from 'react'
import {
    Heading2,
    Heading3,
    Heading4,
    Paragraph,
    SubParagraph,
} from '@entur/typography'
import { Switch, TextField } from '@entur/form'
import { Tooltip } from '@entur/tooltip'
import { ValidationInfoIcon } from '@entur/icons'
import { Button } from '@entur/button'
import { useSettings } from '../../../settings/SettingsProvider'
import { isMobileWeb } from '../../../utils/utils'
import {
    saveToLocalStorage,
    getFromLocalStorage,
} from '../../../settings/LocalStorage'
import { useUniqueLines } from '../../../logic/use-unique-lines/useUniqueLines'
import { useRealtimePositionLineRefs } from '../../../logic/use-realtime-position-line-refs/useRealtimePositionLineRefs'
import { useDebounce } from '../../../hooks/useDebounce'
import { toggleValueInList } from '../../../utils/array'
import { Mode } from '../../../settings/settings'
import { StopPlacePanel } from './StopPlacePanel/StopPlacePanel'
import { BikePanelSearch } from './BikeSearch/BikePanelSearch'
import { StopPlaceSearch } from './StopPlaceSearch/StopPlaceSearch'
import { BikePanel } from './BikePanel/BikePanel'
import { ScooterPanel } from './ScooterPanel/ScooterPanel'
import { RealtimeDataPanel } from './RealtimeDataPanel/RealTimeDataPanel'
import { ToggleDetailsPanel } from './ToggleDetailsPanel/ToggleDetailsPanel'
import { WeatherPanel } from './WeatherPanel/WeatherPanel'
import './EditTab.scss'
import { CustomTilePanel } from './CustomTilePanel/CustomTilePanel'
import { PosterMobilityAlert } from './PosterMobilityAlert'
import { EditTile } from './EditTile/EditTile'

const isMobile = isMobileWeb()

const toolTip = (
    <Tooltip
        content={
            <div>
                <SubParagraph className="tooltip-container-weather">
                    Tilgjengelig i visningstyper kompakt, kronologisk og kart.
                    Værdata fra YR (met.no). Noe værdata kan bli skjult ved
                    liten boksstørrelse.
                </SubParagraph>
            </div>
        }
        placement="top"
    >
        <span>
            <ValidationInfoIcon size={20} />
        </span>
    </Tooltip>
)

const TooltipText = (props: { title: string; text: string }) => (
    <div className="tooltip-container">
        <Heading4 margin="none">{props.title}</Heading4>
        <SubParagraph margin="none">{props.text}</SubParagraph>
    </div>
)

const EditTab = (): JSX.Element => {
    const [settings, setSettings] = useSettings()

    const [distance, setDistance] = useState<number>(settings.distance)

    const { realtimePositionLineRefs } = useRealtimePositionLineRefs()
    const { uniqueLines } = useUniqueLines()

    const realtimeLines = useMemo(
        () =>
            uniqueLines.filter((line) =>
                realtimePositionLineRefs?.includes(line.id),
            ),
        [uniqueLines, realtimePositionLineRefs],
    )

    const debouncedZoom = useDebounce(settings.zoom, 200)

    useEffect(() => {
        if (settings && settings.zoom !== debouncedZoom) {
            setSettings({
                zoom: debouncedZoom,
            })
        }
    }, [settings, debouncedZoom, setSettings])

    const debouncedDistance = useDebounce(distance, 800)
    useEffect(() => {
        if (settings.distance !== debouncedDistance) {
            setSettings({
                distance: debouncedDistance,
            })
        }
    }, [debouncedDistance, setSettings, settings])

    useEffect(() => {
        if (
            settings.showWeather &&
            !settings.showIcon &&
            !settings.showTemperature &&
            !settings.showWind &&
            !settings.showPrecipitation
        )
            setSettings({ showWeather: false })
    }, [
        settings.showIcon,
        settings.showTemperature,
        settings.showWind,
        settings.showPrecipitation,
        settings.showWeather,
        setSettings,
    ])

    const locationName = settings.boardName

    const addNewStation = useCallback(
        (stationId: string) => {
            if (settings.newStations.includes(stationId)) return
            setSettings({
                newStations: [...settings.newStations, stationId],
            })
        },
        [settings.newStations, setSettings],
    )

    const toggleMode = useCallback(
        (mode: Mode) => {
            setSettings({
                hiddenModes: toggleValueInList(settings.hiddenModes, mode),
            })
        },
        [setSettings, settings.hiddenModes],
    )

    const toggleRealtimeData = useCallback(
        () => setSettings({ hideRealtimeData: !settings.hideRealtimeData }),
        [setSettings, settings.hideRealtimeData],
    )
    const [showTooltip, setShowTooltip] = useState<boolean>(false)

    useEffect(() => {
        if (!getFromLocalStorage('hasShownTooltip')) {
            setShowTooltip(true)
            saveToLocalStorage('hasShownTooltip', true)
        }
    }, [])

    const validateInput = (e: SyntheticEvent<HTMLInputElement>) => {
        const newDistance = Number(e.currentTarget.value)
        if (1 <= newDistance && 1000 >= newDistance) {
            setDistance(newDistance)
        } else if (newDistance < 1) {
            setDistance(1)
        } else {
            setDistance(1000)
        }
    }

    const handleWeatherSettingsChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        !(
            settings.showIcon ||
            settings.showTemperature ||
            settings.showWind ||
            settings.showPrecipitation
        ) && !settings.showWeather
            ? setSettings({
                  showWeather: event.currentTarget.checked,
                  showIcon: true,
                  showTemperature: true,
                  showWind: true,
                  showPrecipitation: true,
              })
            : setSettings({
                  showWeather: event.currentTarget.checked,
              })
    }

    const handleUpdateTavle = useCallback(() => {
        setSettings({
            pageRefreshedAt: new Date().getTime(),
        })
    }, [setSettings])

    return (
        <div className="edit-tab">
            <div>
                <Heading2 className="edit-tab__heading">
                    Viser kollektivtilbud innenfor
                    <div className="edit-tab__input-wrapper">
                        <Tooltip
                            content={
                                <TooltipText
                                    title="Endre på avstanden?"
                                    text="Klikk på tallet for
                                        å skrive en ny verdi."
                                />
                            }
                            placement={!isMobile ? 'bottom' : 'bottom-left'}
                            isOpen={showTooltip}
                            showCloseButton={true}
                            disableHoverListener={true}
                            disableFocusListener={true}
                        >
                            <TextField
                                label=""
                                className="edit-tab__expanding-text-field heading"
                                size="medium"
                                defaultValue={distance}
                                onChange={validateInput}
                                append="m"
                                type="number"
                                max={1000}
                                min={1}
                                maxLength={4}
                                minLength={1}
                            />
                        </Tooltip>
                    </div>
                    rundt {locationName?.split(',')[0]}
                </Heading2>
            </div>
            <PosterMobilityAlert />
            <div className="edit-tab__tiles-heading">Mobilitetstilbud</div>
            <div className="edit-tab__tiles-container">
                <EditTile>
                    <div className="edit-tab__header">
                        <Heading2>Kollektiv</Heading2>
                        <Switch
                            onChange={(): void => toggleMode('kollektiv')}
                            checked={
                                !settings.hiddenModes.includes('kollektiv')
                            }
                            size="large"
                        />
                    </div>
                    <StopPlaceSearch distance={debouncedDistance} />
                    <StopPlacePanel distance={debouncedDistance} />
                    <div>
                        <Heading3 className="edit-tab__header--details-in-view">
                            Detaljer i visningen
                        </Heading3>
                    </div>
                    <ToggleDetailsPanel />
                </EditTile>

                <div>
                    <EditTile>
                        <div className="edit-tab__header">
                            <Heading2>Sparkesykkel</Heading2>
                            <Switch
                                onChange={(): void =>
                                    toggleMode('sparkesykkel')
                                }
                                checked={
                                    !settings.hiddenModes.includes(
                                        'sparkesykkel',
                                    )
                                }
                                size="large"
                            />
                        </div>
                        <ScooterPanel />
                    </EditTile>
                    <EditTile>
                        <div className="edit-tab__header">
                            <Heading2>Delebil</Heading2>
                            <Switch
                                onChange={(): void => toggleMode('delebil')}
                                checked={
                                    !settings.hiddenModes.includes('delebil')
                                }
                                size="large"
                            />
                        </div>
                    </EditTile>
                </div>

                <EditTile>
                    <div className="edit-tab__header">
                        <Heading2>Bysykkel</Heading2>
                        <Switch
                            onChange={(): void => toggleMode('bysykkel')}
                            checked={!settings.hiddenModes.includes('bysykkel')}
                            size="large"
                        />
                    </div>
                    {!!settings.coordinates && (
                        <BikePanelSearch
                            position={settings.coordinates}
                            onSelected={addNewStation}
                        />
                    )}
                    <BikePanel />
                </EditTile>
            </div>
            <div className="edit-tab__tiles-heading">Annet</div>
            <div className="edit-tab__tiles-container">
                <div>
                    <EditTile>
                        <div className="edit-tab__header">
                            <Heading2>
                                {'Vær '}
                                {toolTip}
                            </Heading2>
                            <Switch
                                onChange={handleWeatherSettingsChange}
                                checked={settings.showWeather}
                                size="large"
                            />
                        </div>
                        <WeatherPanel />
                    </EditTile>
                    <EditTile>
                        <div className="edit-tab__header">
                            <Heading2>
                                Bilde og QR
                                <Tooltip
                                    content={
                                        <div>
                                            <SubParagraph className="tooltip-container-weather">
                                                Tilgjengelig i visningstyper
                                                kompakt og kronologisk.
                                            </SubParagraph>
                                        </div>
                                    }
                                    placement="top"
                                >
                                    <span>
                                        <ValidationInfoIcon size={20} />
                                    </span>
                                </Tooltip>
                            </Heading2>
                            <Switch
                                onChange={(e) =>
                                    setSettings({
                                        showCustomTiles:
                                            e.currentTarget.checked,
                                    })
                                }
                                checked={settings.showCustomTiles}
                                size="large"
                            />
                        </div>
                        <CustomTilePanel></CustomTilePanel>
                    </EditTile>
                    <EditTile>
                        <div className="edit-tab__header">
                            <Heading2>
                                Entur App QR
                                <Tooltip
                                    content={
                                        <div>
                                            <SubParagraph className="tooltip-container-weather">
                                                Tilgjengelig i visningstyper
                                                kompakt og kronologisk.
                                            </SubParagraph>
                                        </div>
                                    }
                                    placement="top"
                                >
                                    <span>
                                        <ValidationInfoIcon size={20} />
                                    </span>
                                </Tooltip>
                            </Heading2>
                            <Switch
                                onChange={(e) =>
                                    setSettings({
                                        showMobileAppQrTile:
                                            e.currentTarget.checked,
                                    })
                                }
                                checked={settings.showMobileAppQrTile}
                                size="large"
                            />
                        </div>
                    </EditTile>
                </div>

                <EditTile>
                    <div className="edit-tab__header">
                        <Heading2>Sanntidsposisjoner</Heading2>
                        <Switch
                            onChange={() => toggleRealtimeData()}
                            checked={!settings.hideRealtimeData}
                            size="large"
                        ></Switch>
                    </div>
                    {!settings.hiddenModes.includes('kollektiv') ? (
                        <RealtimeDataPanel
                            realtimeLines={realtimeLines}
                            hiddenLines={settings.hiddenRealtimeDataLineRefs}
                        />
                    ) : (
                        <Paragraph>
                            Kollektivdata er skrudd av. Skru det på ved å trykke
                            på knappen øverst til høyre i kollektiv-ruten.
                        </Paragraph>
                    )}
                </EditTile>
                <EditTile>
                    <div className="edit-tab__header">
                        <Heading2>Last inn tavler på nytt</Heading2>
                    </div>
                    <div>
                        <Paragraph>
                            Når du trykker på knappen vil alle skjermer som
                            viser denne tavlen bli lastet inn på nytt.
                        </Paragraph>
                        <Button onClick={handleUpdateTavle} variant="primary">
                            Last inn tavler på nytt
                        </Button>
                    </div>
                </EditTile>
            </div>
        </div>
    )
}

export { EditTab }
