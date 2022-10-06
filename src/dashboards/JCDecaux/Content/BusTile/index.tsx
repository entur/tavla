import { BusIcon } from '@entur/icons'
import React from 'react'

import { StopPlaceWithDepartures, LineData } from '../../../../types'
import { filterMap, groupBy } from '../../../../utils'

import './styles.scss'

function BusTile({ stopPlaceWithDepartures }: Props): JSX.Element | null {
    const { departures, name } = stopPlaceWithDepartures
    const groupedDepartures = groupBy<LineData>(departures, 'route')
    const routes = Object.keys(groupedDepartures)
    //Dataen under er hardkodet, her kommer det nok en Map etterhvert

    return (
        <>
            {/* <Tile
                title={name}
                icons={getTransportHeaderIcons(departures, iconColorType)}
                walkInfo={!hideWalkInfo ? walkInfo : undefined}
            >
                {filterMap(routes, (route) => {
                    const routeData = groupedDepartures[route]
                    const firstRouteData = routeData && routeData[0]
                    if (!firstRouteData) return

                    const subType = firstRouteData.subType
                    const routeType = firstRouteData.type
                    const icon = getIcon(routeType, iconColorType, subType)
                    const platform = firstRouteData.quay?.publicCode
                    return (
                        <TileRow
                            key={route}
                            label={route}
                            subLabels={routeData.map(createTileSubLabel)}
                            icon={icon}
                            hideSituations={hideSituations}
                            hideTracks={hideTracks}
                            platform={platform}
                            type={routeType}
                        />
                    )
                })}
            </Tile> */}

            <div style={{ marginBottom: '2rem' }}>
                <text style={{ fontSize: '2.5rem' }}>Neste buss</text>
            </div>
            <div
                className="available-vehicles-box"
                style={{
                    width: '90%',
                    display: 'inline-block',
                    height: '23%',
                    marginBottom: '10%',
                    padding: '1rem',
                }}
            >
                {filterMap(routes, (route) => {
                    const routeData = groupedDepartures[route]
                    const firstRouteData = routeData && routeData[0]
                    if (!firstRouteData) return

                    // const subType = firstRouteData.subType
                    // const routeType = firstRouteData.type
                    // const platform = firstRouteData.quay?.publicCode
                    return (
                        <div>
                            {route}
                            {/* <TileRow
                                key={route}
                                label={route}
                                subLabels={routeData.map(createTileSubLabel)}
                                icon={icon}
                                hideSituations={hideSituations}
                                hideTracks={hideTracks}
                                platform={platform}
                                type={routeType}
                            /> */}
                        </div>
                    )
                })}

                {/* <div className="row-box">
                    <div className="red-box">
                        <BusIcon
                            color="white"
                            style={{
                                height: '4rem',
                                width: '4rem',
                                marginLeft: '1rem',
                            }}
                        />
                        <p className="lineNumber">523</p>
                    </div>
                    <text className="stopPlace">Tusenfryd</text>
                    <text className="time">13:22</text>
                </div> */}
            </div>

            {/* <div style={{ marginBottom: '2rem' }}>
                <text style={{ fontSize: '2.5rem' }}>Neste buss</text>
            </div>
            <div
                className="available-vehicles-box"
                style={{
                    width: '90%',
                    display: 'inline-block',
                    height: '23%',
                    marginBottom: '10%',
                    padding: '1rem',
                }}
            >
                <div className="row-box">
                    <div className="red-box">
                        <BusIcon
                            color="white"
                            style={{
                                height: '4rem',
                                width: '4rem',
                                marginLeft: '1rem',
                            }}
                        />
                        <p className="lineNumber">510</p>
                    </div>
                    <text className="stopPlace">Bøleråsen</text>
                    <text className="time">Nå</text>
                </div>

                <div className="row-box">
                    <div className="red-box">
                        <BusIcon
                            color="white"
                            style={{
                                height: '4rem',
                                width: '4rem',
                                marginLeft: '1rem',
                            }}
                        />
                        <p className="lineNumber">520</p>
                    </div>
                    <text className="stopPlace">Vinterbro</text>
                    <text className="time">5 min</text>
                </div>

                <div className="row-box">
                    <div className="red-box">
                        <BusIcon
                            color="white"
                            style={{
                                height: '4rem',
                                width: '4rem',
                                marginLeft: '1rem',
                            }}
                        />
                        <p className="lineNumber">523</p>
                    </div>
                    <text className="stopPlace">Tusenfryd</text>
                    <text className="time">13:22</text>
                </div>
            </div> */}
        </>
    )
}

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures
    platform?: string
    type?: string
}

export default BusTile
