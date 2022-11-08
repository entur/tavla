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
import { isMobileWeb, getTranslation } from '../../../utils/utils'
import { StopPlaceWithLines } from '../../../types'
import { useNearestPlaces, useRentalStations } from '../../../logic'
import { getStopPlacesWithLines } from '../../../logic/get-stop-places-with-lines/getStopPlacesWithLines'
import {
    saveToLocalStorage,
    getFromLocalStorage,
} from '../../../settings/LocalStorage'
import { useStopPlacesWithLines } from '../../../logic/useStopPlacesWithLines'
import { useLinesWithRealtimePositions } from '../../../logic/use-lines-with-realtime-positions/useLinesWithRealtimePositions'
import { isNotNullOrUndefined } from '../../../utils/typeguards'
import { useDebounce } from '../../../hooks/useDebounce'
import { toggleValueInList } from '../../../utils/array'
import { Mode } from '../../../settings/settings'
import { FormFactor } from '../../../../graphql-generated/mobility-v2'
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

    const allLinesWithRealtimeData = useLinesWithRealtimePositions()
    const uniqueLines = useStopPlacesWithLines()

    const realtimeLines = useMemo(
        () =>
            uniqueLines.filter((line) =>
                allLinesWithRealtimeData?.includes(line.id),
            ),
        [uniqueLines, allLinesWithRealtimeData],
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

    const [stopPlaces, setStopPlaces] = useState<
        StopPlaceWithLines[] | undefined
    >(undefined)
    const bikeRentalStations = useRentalStations(false, FormFactor.Bicycle)

    const nearestPlaces = useNearestPlaces(
        settings.coordinates,
        debouncedDistance,
    )

    const locationName = settings.boardName

    const nearestStopPlaceIds = useMemo(
        () =>
            nearestPlaces
                .filter(({ type }) => type === 'StopPlace')
                .map(({ id }) => id),
        [nearestPlaces],
    )

    useEffect(() => {
        let aborted = false
        const ids = [...settings.newStops, ...nearestStopPlaceIds]

        getStopPlacesWithLines(
            ids.map((id: string) => id.replace(/-\d+$/, '')),
        ).then((resultingStopPlaces) => {
            if (aborted) {
                return
            }
            setStopPlaces(
                resultingStopPlaces.map((s, index) => ({
                    ...s,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    id: ids[index]!,
                })),
            )
        })

        return (): void => {
            aborted = true
        }
    }, [nearestPlaces, nearestStopPlaceIds, settings.newStops])

    const sortedBikeRentalStations = useMemo(
        () =>
            bikeRentalStations.filter(isNotNullOrUndefined).sort((a, b) => {
                const aName = getTranslation(a.name)
                const bName = getTranslation(b.name)
                if (!aName) return 1
                if (!bName) return -1
                return aName.localeCompare(bName, 'no')
            }),
        [bikeRentalStations],
    )

    const addNewStop = useCallback(
        (stopId: string) => {
            const numberOfDuplicates = [
                ...nearestStopPlaceIds,
                ...settings.newStops,
            ]
                .map((id) => id.replace(/-\d+$/, ''))
                .filter((id) => id === stopId).length

            const id = !numberOfDuplicates
                ? stopId
                : `${stopId}-${numberOfDuplicates}`

            setSettings({
                newStops: [...settings.newStops, id],
            })
        },
        [nearestStopPlaceIds, settings.newStops, setSettings],
    )

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
            <div>
                <div className="edit-tab__tiles-heading">Mobilitetstilbud</div>
                <div className="edit-tab__flex-container">
                    <div className="edit-tab__flex-item">
                        <div className="edit-tab__header">
                            <Heading2>Kollektiv</Heading2>
                            <Switch
                                onChange={(): void => toggleMode('kollektiv')}
                                checked={settings.hiddenModes.includes(
                                    'kollektiv',
                                )}
                                size="large"
                            />
                        </div>
                        <div className="edit-tab__set-stops">
                            <StopPlaceSearch handleAddNewStop={addNewStop} />
                        </div>
                        <StopPlacePanel stops={stopPlaces} />
                        <div>
                            <Heading3 className="edit-tab__header--details-in-view">
                                Detaljer i visningen
                            </Heading3>
                        </div>
                        <ToggleDetailsPanel />
                    </div>

                    <div>
                        <div className=" edit-tab__flex-item">
                            <div className="edit-tab__header">
                                <Heading2>Sparkesykkel</Heading2>
                                <Switch
                                    onChange={(): void =>
                                        toggleMode('sparkesykkel')
                                    }
                                    checked={settings.hiddenModes.includes(
                                        'sparkesykkel',
                                    )}
                                    size="large"
                                />
                            </div>
                            <ScooterPanel />
                        </div>
                        <div className="edit-tab__flex-item">
                            <div className="edit-tab__header">
                                <Heading2>Delebil</Heading2>
                                <Switch
                                    onChange={(): void => toggleMode('delebil')}
                                    checked={settings.hiddenModes.includes(
                                        'delebil',
                                    )}
                                    size="large"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="edit-tab__flex-item">
                        <div className="edit-tab__header">
                            <Heading2>Bysykkel</Heading2>
                            <Switch
                                onChange={(): void => toggleMode('bysykkel')}
                                checked={settings.hiddenModes.includes(
                                    'bysykkel',
                                )}
                                size="large"
                            />
                        </div>
                        {!!settings?.coordinates && (
                            <BikePanelSearch
                                position={settings.coordinates}
                                onSelected={addNewStation}
                            />
                        )}
                        <BikePanel stations={sortedBikeRentalStations} />
                    </div>
                    {/* <div key="mapPanel" className="edit-tab__tile">
                    <div className="edit-tab__header">
                        <Heading2>Kart</Heading2>
                        <Switch
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ): void => {
                                setSettings({
                                    showMap: event.currentTarget.checked,
                                })
                            }}
                            checked={showMap}
                            size="large"
                        />
                    </div>
                    {settings.showMap && (
                        <ZoomEditor
                            zoom={zoom}
                            onZoomUpdated={setZoom}
                            scooters={scooters}
                        />
                    )}
                </div> */}
                </div>
            </div>
            <div className="edit-tab__tiles-heading">Annet</div>
            <div className="edit-tab__flex-container">
                <div>
                    <div className="edit-tab__flex-item">
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
                    </div>
                    <div className="edit-tab__flex-item">
                        <div className="edit-tab__header">
                            <Heading2>
                                {'Bilde og QR '}
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
                    </div>
                </div>
                <div className="edit-tab__flex-item">
                    <div className="edit-tab__header">
                        <Heading2>Sanntidsposisjoner</Heading2>
                        <Switch
                            onChange={() => toggleRealtimeData()}
                            checked={settings.hideRealtimeData}
                            size="large"
                        ></Switch>
                    </div>
                    {settings.hiddenModes.includes('kollektiv') ? (
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
                </div>
                <div className="edit-tab__flex-item">
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
                </div>
            </div>
        </div>
    )
}

export { EditTab }
