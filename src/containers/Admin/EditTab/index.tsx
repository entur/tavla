import React, {
    useState,
    useMemo,
    useEffect,
    useCallback,
    SyntheticEvent,
} from 'react'
import { Heading2, Heading3, Heading4, SubParagraph } from '@entur/typography'
import { Switch, TextField } from '@entur/form'
import { Tooltip } from '@entur/tooltip'
import { WidthProvider, Responsive } from 'react-grid-layout'

import { FormFactor, Station } from '@entur/sdk/lib/mobility/types'

import { useSettingsContext, Mode } from '../../../settings'

import {
    useDebounce,
    toggleValueInList,
    isNotNullOrUndefined,
    isMobileWeb,
    getTranslation,
} from '../../../utils'

import { DEFAULT_DISTANCE, DEFAULT_ZOOM } from '../../../constants'
import { StopPlaceWithLines } from '../../../types'
import {
    useNearestPlaces,
    useMobility,
    useBikeRentalStations,
} from '../../../logic'
import { getStopPlacesWithLines } from '../../../service'
import {
    saveToLocalStorage,
    getFromLocalStorage,
} from '../../../settings/LocalStorage'

import StopPlacePanel from './StopPlacePanel'
import BikePanelSearch from './BikeSearch'
import StopPlaceSearch from './StopPlaceSearch'
import BikePanel from './BikePanel'
import ScooterPanel from './ScooterPanel'
import ZoomEditor from './ZoomEditor'
import ToggleDetailsPanel from './ToggleDetailsPanel'

import './styles.scss'

const isMobile = isMobileWeb()
const ResponsiveReactGridLayout = WidthProvider(Responsive)

const COLS: { [key: string]: number } = {
    lg: 4.5,
    md: 3,
    sm: 1,
    xs: 1,
    xxs: 1,
}

const EditTab = (): JSX.Element => {
    const [breakpoint, setBreakpoint] = useState<string>('lg')
    const [settings, setSettings] = useSettingsContext()
    const {
        newStops = [],
        newStations = [],
        hiddenModes,
        showMap,
    } = settings || {}
    const [distance, setDistance] = useState<number>(
        settings?.distance || DEFAULT_DISTANCE,
    )

    const [zoom, setZoom] = useState<number>(settings?.zoom || DEFAULT_ZOOM)
    const debouncedZoom = useDebounce(zoom, 200)

    useEffect(() => {
        if (settings && settings.zoom !== debouncedZoom) {
            setSettings({
                zoom: debouncedZoom,
            })
        }
    }, [settings, debouncedZoom, setSettings])

    const debouncedDistance = useDebounce(distance, 800)
    useEffect(() => {
        if (settings?.distance !== debouncedDistance) {
            setSettings({
                distance: debouncedDistance,
            })
        }
    }, [debouncedDistance, setSettings, settings])

    const [stopPlaces, setStopPlaces] = useState<StopPlaceWithLines[]>([])
    const bikeRentalStations: Station[] | null = useBikeRentalStations()
    const [sortedBikeRentalStations, setSortedBikeRentalStations] = useState<
        Station[]
    >([])

    const nearestPlaces = useNearestPlaces(
        settings?.coordinates,
        debouncedDistance,
    )

    const locationName = settings?.boardName

    const nearestStopPlaceIds = useMemo(
        () =>
            nearestPlaces
                .filter(({ type }) => type === 'StopPlace')
                .map(({ id }) => id),
        [nearestPlaces],
    )
    const scooters = useMobility(FormFactor.SCOOTER)

    useEffect(() => {
        let ignoreResponse = false
        const ids = [...newStops, ...nearestStopPlaceIds]

        getStopPlacesWithLines(
            ids.map((id: string) => id.replace(/-\d+$/, '')),
        ).then((resultingStopPlaces) => {
            if (ignoreResponse) return

            setStopPlaces(
                resultingStopPlaces.map((s, index) => ({
                    ...s,
                    id: ids[index],
                })),
            )
        })

        return (): void => {
            ignoreResponse = true
        }
    }, [nearestPlaces, nearestStopPlaceIds, newStops])

    useEffect(() => {
        let ignoreResponse = false

        if (bikeRentalStations) {
            const sortedStations = bikeRentalStations
                .filter(isNotNullOrUndefined)
                .sort((a: Station, b: Station) =>
                    (getTranslation(a.name) || a.id).localeCompare(
                        getTranslation(b.name) || b.id,
                        'no',
                    ),
                )
            if (!ignoreResponse) {
                setSortedBikeRentalStations(sortedStations)
            }
        }

        return (): void => {
            ignoreResponse = true
        }
    }, [bikeRentalStations])

    const addNewStop = useCallback(
        (stopId: string) => {
            const numberOfDuplicates = [...nearestStopPlaceIds, ...newStops]
                .map((id) => id.replace(/-\d+$/, ''))
                .filter((id) => id === stopId).length

            const id = !numberOfDuplicates
                ? stopId
                : `${stopId}-${numberOfDuplicates}`

            setSettings({
                newStops: [...newStops, id],
            })
        },
        [nearestStopPlaceIds, newStops, setSettings],
    )

    const addNewStation = useCallback(
        (stationId: string) => {
            setSettings({
                newStations: [...newStations, stationId],
            })
        },
        [newStations, setSettings],
    )

    const toggleMode = useCallback(
        (mode: Mode) => {
            setSettings({
                hiddenModes: toggleValueInList(hiddenModes || [], mode),
            })
        },
        [setSettings, hiddenModes],
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

    const TooltipText = (props: { title: string; text: string }) => (
        <div className="tooltip-container">
            <Heading4 margin="none">{props.title}</Heading4>
            <SubParagraph margin="none">{props.text}</SubParagraph>
        </div>
    )

    // height of tile is set to default value + a value times number of rows
    const tileHeight = (items: number, rowHeight: number, padding: number) =>
        items > 0 ? items * rowHeight + padding : 0

    const LAYOUT = {
        lg: [
            {
                i: 'busStopPanel',
                x: 0,
                y: 0,
                w: 1.5,
                h: 2.35 + tileHeight(stopPlaces.length, 0.45, 0.35),
            },
            {
                i: 'bikePanel',
                x: 1.5,
                y: 0,
                w: 1.5,
                h: 1.55 + tileHeight(sortedBikeRentalStations.length, 0.24, 0),
            },
            { i: 'scooterPanel', x: 3, y: 3.2, w: 1.5, h: 1.4 },
            { i: 'mapPanel', x: 3, y: 0, w: 1.5, h: 3.2 },
        ],
        md: [
            {
                i: 'busStopPanel',
                x: 0,
                y: 0,
                w: 2,
                h: 2.35 + tileHeight(stopPlaces.length, 0.44, 0.32),
            },
            {
                i: 'bikePanel',
                x: 2,
                y: 0,
                w: 1,
                h: 1.55 + tileHeight(sortedBikeRentalStations.length, 0.24, 0),
            },
            { i: 'scooterPanel', x: 2, y: 3, w: 1, h: 1.75 },
            { i: 'mapPanel', x: 0, y: 4.5, w: 2, h: 3 },
        ],
        sm: [
            {
                i: 'busStopPanel',
                x: 0,
                y: 0,
                w: 1,
                h: 2.25 + tileHeight(stopPlaces.length, 0.6, 0.32),
            },
            {
                i: 'bikePanel',
                x: 0,
                y: 3,
                w: 1,
                h: 1.4 + tileHeight(sortedBikeRentalStations.length, 0.24, 0),
            },
            { i: 'scooterPanel', x: 0, y: 5, w: 1, h: 1.2 },
            { i: 'mapPanel', x: 0, y: 8, w: 1, h: 3 },
        ],
        xs: [
            {
                i: 'busStopPanel',
                x: 0,
                y: 0,
                w: 1,
                h: 2.5 + tileHeight(stopPlaces.length, 0.75, 0.25),
            },
            {
                i: 'bikePanel',
                x: 0,
                y: 3,
                w: 1,
                h: 1.4 + tileHeight(sortedBikeRentalStations.length, 0.265, 0),
            },
            { i: 'scooterPanel', x: 0, y: 5, w: 1, h: 1.6 },
            { i: 'mapPanel', x: 0, y: 8, w: 1, h: 3 },
        ],
    }

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
                            popperModifiers={[
                                {
                                    name: 'offset',
                                    options: {
                                        offset: !isMobile ? [20, 30] : [15, 20],
                                    },
                                },
                            ]}
                        >
                            <TextField
                                className="edit-tab__expanding-text-field heading"
                                size="large"
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

            <ResponsiveReactGridLayout
                key={breakpoint}
                cols={COLS}
                layouts={LAYOUT}
                autoSize={true}
                margin={isMobile ? [0, 16] : [32, 32]}
                isResizable={false}
                isDraggable={false}
                onBreakpointChange={(newBreakpoint: string) => {
                    setBreakpoint(newBreakpoint)
                }}
            >
                <div key="busStopPanel" className="edit-tab__tile">
                    <div className="edit-tab__header">
                        <Heading2>Kollektiv</Heading2>
                        <Switch
                            onChange={(): void => toggleMode('kollektiv')}
                            checked={!hiddenModes?.includes('kollektiv')}
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
                <div key="bikePanel" className="edit-tab__tile">
                    <div className="edit-tab__header">
                        <Heading2>Bysykkel</Heading2>
                        <Switch
                            onChange={(): void => toggleMode('bysykkel')}
                            checked={!hiddenModes?.includes('bysykkel')}
                            size="large"
                        />
                    </div>
                    <BikePanelSearch
                        position={settings?.coordinates}
                        onSelected={addNewStation}
                    />
                    <BikePanel stations={sortedBikeRentalStations} />
                </div>
                <div key="scooterPanel" className="edit-tab__tile">
                    <div className="edit-tab__header">
                        <Heading2>Sparkesykkel</Heading2>
                        <Switch
                            onChange={(): void => toggleMode('sparkesykkel')}
                            checked={!hiddenModes?.includes('sparkesykkel')}
                            size="large"
                        />
                    </div>
                    <ScooterPanel />
                </div>
                <div key="mapPanel" className="edit-tab__tile">
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
                    <ZoomEditor
                        zoom={zoom}
                        onZoomUpdated={setZoom}
                        scooters={scooters}
                    />
                </div>
            </ResponsiveReactGridLayout>
        </div>
    )
}

export default EditTab
