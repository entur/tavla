import React, { useState, useEffect } from 'react'
import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout'
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from 'react-beautiful-dnd'

import { Modal } from '@entur/modal'
import { PrimaryButton } from '@entur/button'

import {
    useBikeRentalStations,
    useStopPlacesWithDepartures,
    useScooters,
} from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'
import ResizeHandle from '../../assets/icons/ResizeHandle'

import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'

import { useSettingsContext } from '../../settings'

import { DEFAULT_ZOOM } from '../../constants'
import { usePrevious } from '../../utils'

import DepartureTile from './DepartureTile'
import BikeTile from './BikeTile'
import MapTile from './MapTile'

import './styles.scss'
import { DraggableIcon } from '@entur/icons'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

function isMobileWeb(): boolean {
    return (
        typeof window.orientation !== 'undefined' ||
        navigator.userAgent.indexOf('IEMobile') !== -1
    )
}

function getDataGrid(
    index: number,
    maxWidth: number,
): { [key: string]: number } {
    return {
        w: 1,
        maxW: maxWidth,
        minH: 1,
        h: 4,
        x: index % maxWidth,
        y: 0,
    }
}

const BREAKPOINTS = {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
}

const COLS: { [key: string]: number } = {
    lg: 4,
    md: 3,
    sm: 1,
    xs: 1,
    xxs: 1,
}

const EnturDashboard = ({ history }: Props): JSX.Element => {
    const [settings] = useSettingsContext()
    const [breakpoint, setBreakpoint] = useState<string>('lg')
    const dashboardKey = history.location.key
    const [gridLayouts, setGridLayouts] = useState<Layouts | undefined>(
        getFromLocalStorage(dashboardKey),
    )

    const [tileOrder, setTileOrder] = useState<TileItem[]>([])

    const bikeRentalStations = useBikeRentalStations()

    const scooters = useScooters()

    let stopPlacesWithDepartures = useStopPlacesWithDepartures()

    if (stopPlacesWithDepartures) {
        stopPlacesWithDepartures = stopPlacesWithDepartures.filter(
            ({ departures }) => departures.length > 0,
        )
    }

    const numberOfStopPlaces = stopPlacesWithDepartures
        ? stopPlacesWithDepartures.length
        : 0
    const anyBikeRentalStations: number | null =
        bikeRentalStations && bikeRentalStations.length

    const bikeCol = anyBikeRentalStations ? 1 : 0
    const hasData = Boolean(
        bikeRentalStations?.length ||
            scooters?.length ||
            stopPlacesWithDepartures?.length,
    )
    const mapCol = hasData ? 1 : 0
    const totalItems = numberOfStopPlaces + bikeCol + mapCol

    const maxWidthCols = COLS[breakpoint]

    const prevNumberOfStopPlaces = usePrevious(numberOfStopPlaces)

    const [isOpen, setOpen] = React.useState(false) // for debugging

    useEffect(() => {
        const defaultTileOrder: TileItem[] = []
        if (stopPlacesWithDepartures) {
            if (stopPlacesWithDepartures.length == prevNumberOfStopPlaces) {
                return
            }
            stopPlacesWithDepartures.map((item) => {
                defaultTileOrder.push({ id: item.id, name: item.name })
            })
        }
        if (anyBikeRentalStations) {
            defaultTileOrder.push({ id: 'city-bike', name: 'Bysykkel' })
        }
        if (mapCol) {
            defaultTileOrder.push({ id: 'map', name: 'Kart' })
        }
        setTileOrder(defaultTileOrder)
    }, [
        stopPlacesWithDepartures,
        prevNumberOfStopPlaces,
        anyBikeRentalStations,
        mapCol,
    ])

    const reorder = (
        list: TileItem[],
        startIndex: number,
        endIndex: number,
    ) => {
        const result = Array.from(list)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)

        return result
    }

    function onDragEnd(result: DropResult): void {
        if (!result.destination) return
        if (result.destination.index === result.source.index) return
        const rearrangedTileOrder = reorder(
            tileOrder,
            result.source.index,
            result.destination.index,
        )

        setTileOrder(rearrangedTileOrder)
    }

    if (window.innerWidth < BREAKPOINTS.md) {
        return (
            <DashboardWrapper
                className="compact"
                history={history}
                bikeRentalStations={bikeRentalStations}
                stopPlacesWithDepartures={stopPlacesWithDepartures}
                scooters={scooters}
            >
                <div className="compact__tiles--mobile">
                    <Modal
                        open={isOpen}
                        onDismiss={() => setOpen(false)}
                        title="Endre rekkefølge"
                        size="medium"
                    >
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="droppable">
                                {(droppableProvided) => (
                                    <div
                                        {...droppableProvided.droppableProps}
                                        ref={droppableProvided.innerRef}
                                    >
                                        {tileOrder.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}
                                            >
                                                {(
                                                    draggableProvided,
                                                    draggableSnapshot,
                                                ) => (
                                                    <div
                                                        className={`compact__draggable-row ${
                                                            draggableSnapshot.isDragging
                                                                ? 'compact__draggable-row--is-dragging'
                                                                : ''
                                                        }`}
                                                        ref={
                                                            draggableProvided.innerRef
                                                        }
                                                        {...draggableProvided.draggableProps}
                                                        {...draggableProvided.dragHandleProps}
                                                    >
                                                        {item.name}
                                                        <DraggableIcon />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {droppableProvided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <PrimaryButton onClick={() => setOpen(false)}>
                            Lukk
                        </PrimaryButton>
                    </Modal>
                    <PrimaryButton onClick={() => setOpen(true)} type="button">
                        Endre rekkefølge
                    </PrimaryButton>
                    {tileOrder.map((item) => {
                        if (item.id == 'map') {
                            return hasData && settings?.showMap ? (
                                <div key={item.id}>
                                    <MapTile
                                        scooters={scooters}
                                        stopPlaces={stopPlacesWithDepartures}
                                        bikeRentalStations={bikeRentalStations}
                                        walkTimes={null}
                                        latitude={
                                            settings?.coordinates?.latitude ?? 0
                                        }
                                        longitude={
                                            settings?.coordinates?.longitude ??
                                            0
                                        }
                                        zoom={settings?.zoom ?? DEFAULT_ZOOM}
                                    />
                                </div>
                            ) : (
                                []
                            )
                        } else if (item.id == 'city-bike') {
                            return bikeRentalStations &&
                                anyBikeRentalStations ? (
                                <div key={item.id}>
                                    <BikeTile stations={bikeRentalStations} />
                                </div>
                            ) : (
                                []
                            )
                        } else if (stopPlacesWithDepartures) {
                            const stopIndex =
                                stopPlacesWithDepartures.findIndex(
                                    (p) => p.id == item.id,
                                )
                            return (
                                <div key={item.id}>
                                    <DepartureTile
                                        stopPlaceWithDepartures={
                                            stopPlacesWithDepartures[stopIndex]
                                        }
                                    />
                                </div>
                            )
                        }
                    })}
                </div>
            </DashboardWrapper>
        )
    }

    return (
        <DashboardWrapper
            className="compact"
            history={history}
            bikeRentalStations={bikeRentalStations}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
            scooters={scooters}
        >
            <div className="compact__tiles">
                <ResponsiveReactGridLayout
                    key={breakpoint}
                    breakpoints={BREAKPOINTS}
                    cols={COLS}
                    layouts={gridLayouts}
                    isResizable={!isMobileWeb()}
                    isDraggable={!isMobileWeb()}
                    onBreakpointChange={(newBreakpoint: string) => {
                        setBreakpoint(newBreakpoint)
                    }}
                    onLayoutChange={(
                        layout: Layout[],
                        layouts: Layouts,
                    ): void => {
                        if (numberOfStopPlaces > 0) {
                            setGridLayouts(layouts)
                            saveToLocalStorage(dashboardKey, layouts)
                        }
                    }}
                >
                    {(stopPlacesWithDepartures || []).map((stop, index) => (
                        <div
                            key={stop.id}
                            data-grid={getDataGrid(index, maxWidthCols)}
                        >
                            <ResizeHandle
                                size="32"
                                className="resizeHandle"
                                variant="light"
                            />
                            <DepartureTile
                                key={index}
                                stopPlaceWithDepartures={stop}
                            />
                        </div>
                    ))}
                    {bikeRentalStations && anyBikeRentalStations ? (
                        <div
                            key="city-bike"
                            data-grid={getDataGrid(
                                numberOfStopPlaces,
                                maxWidthCols,
                            )}
                        >
                            {!isMobileWeb() ? (
                                <ResizeHandle
                                    size="32"
                                    className="resizeHandle"
                                    variant="light"
                                />
                            ) : null}
                            <BikeTile stations={bikeRentalStations} />
                        </div>
                    ) : (
                        []
                    )}
                    {hasData && settings?.showMap ? (
                        <div
                            id="compact-map-tile"
                            key="map"
                            data-grid={getDataGrid(
                                totalItems - 1,
                                maxWidthCols,
                            )}
                        >
                            {!isMobileWeb() ? (
                                <ResizeHandle
                                    size="32"
                                    className="resizeHandle"
                                    variant="dark"
                                />
                            ) : null}

                            <MapTile
                                scooters={scooters}
                                stopPlaces={stopPlacesWithDepartures}
                                bikeRentalStations={bikeRentalStations}
                                walkTimes={null}
                                latitude={settings?.coordinates?.latitude ?? 0}
                                longitude={
                                    settings?.coordinates?.longitude ?? 0
                                }
                                zoom={settings?.zoom ?? DEFAULT_ZOOM}
                            />
                        </div>
                    ) : (
                        []
                    )}
                </ResponsiveReactGridLayout>
            </div>
        </DashboardWrapper>
    )
}

interface Props {
    history: any
}

interface TileItem {
    id: string
    name: string
}

export default EnturDashboard
