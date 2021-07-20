import React, {
    useState,
    useMemo,
    useEffect,
    useCallback,
    SyntheticEvent,
} from 'react'
import { BikeRentalStation } from '@entur/sdk'
import { Heading2, Heading3, Heading4, SubParagraph } from '@entur/typography'
import { Switch, TextField } from '@entur/form'
import { Tooltip } from '@entur/tooltip'
import { WidthProvider, Responsive } from 'react-grid-layout'

import { useSettingsContext, Mode } from '../../../settings'

import {
    useDebounce,
    toggleValueInList,
    isNotNullOrUndefined,
    isMobileWeb,
} from '../../../utils'

import { DEFAULT_DISTANCE, DEFAULT_ZOOM } from '../../../constants'
import { StopPlaceWithLines } from '../../../types'
import { useNearestPlaces, useScooters } from '../../../logic'
import service, { getStopPlacesWithLines } from '../../../service'
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

const LAYOUT = {
    lg: [
        { i: 'busStopPanel', x: 0, y: 0, w: 1.5, h: 4.3 },
        { i: 'bikePanel', x: 1.5, y: 0, w: 1.5, h: 3 },
        { i: 'scooterPanel', x: 1.5, y: 1.5, w: 1.5, h: 1.3 },
        { i: 'mapPanel', x: 3, y: 0, w: 1.5, h: 3.3 },
    ],
    md: [
        { i: 'busStopPanel', x: 0, y: 0, w: 2, h: 4.7 },
        { i: 'bikePanel', x: 2, y: 0, w: 1, h: 3 },
        { i: 'scooterPanel', x: 2, y: 3, w: 1, h: 1.7 },
        { i: 'mapPanel', x: 0, y: 4.5, w: 3, h: 3 },
    ],
    sm: [
        { i: 'busStopPanel', x: 0, y: 0, w: 1, h: 3 },
        { i: 'bikePanel', x: 0, y: 3, w: 1, h: 2 },
        { i: 'scooterPanel', x: 0, y: 5, w: 1, h: 1.5 },
        { i: 'mapPanel', x: 0, y: 8, w: 1, h: 3 },
    ],
}

const EditTab = (): JSX.Element => {
    const [breakpoint, setBreakpoint] = useState<string>('lg')
    const [settings, settingsSetters] = useSettingsContext()
    const { newStops, newStations, hiddenModes, showMap } = settings || {}
    const { setNewStops, setNewStations, setHiddenModes, setShowMap } =
        settingsSetters
    const [distance, setDistance] = useState<number>(
        settings?.distance || DEFAULT_DISTANCE,
    )

    const [zoom, setZoom] = useState<number>(settings?.zoom || DEFAULT_ZOOM)
    const debouncedZoom = useDebounce(zoom, 200)

    useEffect(() => {
        if (settings && settings.zoom !== debouncedZoom) {
            settingsSetters.setZoom(debouncedZoom)
        }
    }, [settings, debouncedZoom, settingsSetters])

    const debouncedDistance = useDebounce(distance, 800)
    useEffect(() => {
        if (settings?.distance !== debouncedDistance) {
            settingsSetters.setDistance(debouncedDistance)
        }
    }, [debouncedDistance, settingsSetters, settings])

    const [stopPlaces, setStopPlaces] = useState<StopPlaceWithLines[]>([])
    const [stations, setStations] = useState<BikeRentalStation[]>([])

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
    const scooters = useScooters()

    useEffect(() => {
        let ignoreResponse = false

        const ids = [...newStops, ...nearestStopPlaceIds]

        getStopPlacesWithLines(ids.map((id) => id.replace(/-\d+$/, ''))).then(
            (resultingStopPlaces) => {
                if (ignoreResponse) return

                setStopPlaces(
                    resultingStopPlaces.map((s, index) => ({
                        ...s,
                        id: ids[index],
                    })),
                )
            },
        )

        return (): void => {
            ignoreResponse = true
        }
    }, [nearestPlaces, nearestStopPlaceIds, newStops])

    useEffect(() => {
        let ignoreResponse = false

        const nearestBikeRentalStationIds = nearestPlaces
            .filter(({ type }) => type === 'BikeRentalStation')
            .map(({ id }) => id)

        const ids = [...newStations, ...nearestBikeRentalStationIds]

        service.getBikeRentalStations(ids).then((freshStations) => {
            if (ignoreResponse) return

            const sortedStations = freshStations
                .filter(isNotNullOrUndefined)
                .sort((a: BikeRentalStation, b: BikeRentalStation) =>
                    a.name.localeCompare(b.name, 'no'),
                )
            setStations(sortedStations)
        })

        return (): void => {
            ignoreResponse = true
        }
    }, [nearestPlaces, newStations])

    const addNewStop = useCallback(
        (stopId: string) => {
            const numberOfDuplicates = [...nearestStopPlaceIds, ...newStops]
                .map((id) => id.replace(/-\d+$/, ''))
                .filter((id) => id === stopId).length
            const id = !numberOfDuplicates
                ? stopId
                : `${stopId}-${numberOfDuplicates}`
            setNewStops([...newStops, id])
        },
        [nearestStopPlaceIds, newStops, setNewStops],
    )

    const addNewStation = useCallback(
        (stationId: string) => {
            setNewStations([...newStations, stationId])
        },
        [newStations, setNewStations],
    )

    const toggleMode = useCallback(
        (mode: Mode) => {
            setHiddenModes(toggleValueInList(hiddenModes || [], mode))
        },
        [setHiddenModes, hiddenModes],
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

    return (
        <div className="edit-tab">
            <div>
                <Heading2 className="heading">
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
                            disableHoverListener={false}
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
                                onKeyDown={validateInput}
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
                        <Heading3>Detaljer i visningen</Heading3>
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
                    <BikePanel stations={stations} />
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
                                setShowMap(event.currentTarget.checked)
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
