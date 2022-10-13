import React from 'react'
import { Tooltip } from '@entur/tooltip'
import { colors } from '@entur/tokens'
import { LegMode, TransportMode } from '@entur/sdk'
import { getIconColor } from '../../../utils'
import { IconColorType } from '../../../types'
import { RealtimeVehicle } from '../../../services/realtimeVehicles/types/realtimeVehicle'
import { useSettings } from '../../../settings/SettingsProvider'
import { TooltipContent } from './TooltipContent/TooltipContent'
import './RealtimeVehicleTag.scss'

interface Props {
    realtimeVehicle: RealtimeVehicle
    setHoveredVehicle: (realtimeVehicle: RealtimeVehicle | undefined) => void
    isHovered: boolean
}

const RealtimeVehicleTag = ({
    realtimeVehicle,
    setHoveredVehicle,
    isHovered,
}: Props): JSX.Element => {
    const [settings, setSettings] = useSettings()

    const { permanentlyVisibleRoutesInMap = [] } = settings || {}

    return (
        <Tooltip
            placement="top"
            content={<TooltipContent realtimeVehicle={realtimeVehicle} />}
            className={`map__realtime-vehicle-tag-tooltip ${
                isHovered ? 'visible' : ''
            }`}
            disableHoverListener={true}
            isOpen={true}
            showCloseButton={false}
        >
            <div
                className="map__realtime-vehicle-tag-circle-outer"
                onMouseEnter={() => setHoveredVehicle(realtimeVehicle)}
                onMouseLeave={() => setHoveredVehicle(undefined)}
                style={
                    realtimeVehicle.active
                        ? { backgroundColor: 'white' }
                        : { backgroundColor: colors.greys.grey30 }
                }
                onClick={() => {
                    if (
                        permanentlyVisibleRoutesInMap
                            .map((drawableRoute) => drawableRoute.lineRef)
                            .includes(realtimeVehicle.line.lineRef)
                    ) {
                        setSettings({
                            permanentlyVisibleRoutesInMap:
                                permanentlyVisibleRoutesInMap.filter(
                                    ({ lineRef }) =>
                                        lineRef !==
                                        realtimeVehicle.line.lineRef,
                                ),
                        })
                    } else {
                        if (realtimeVehicle.line.pointsOnLink)
                            setSettings({
                                permanentlyVisibleRoutesInMap: [
                                    ...permanentlyVisibleRoutesInMap,
                                    {
                                        pointsOnLink:
                                            realtimeVehicle.line.pointsOnLink,
                                        mode: realtimeVehicle.mode,
                                        lineRef: realtimeVehicle.line.lineRef,
                                    },
                                ],
                            })
                    }
                }}
            >
                <div
                    className="map__realtime-vehicle-tag-circle-inner"
                    style={
                        realtimeVehicle.active
                            ? {
                                  backgroundColor: getIconColor(
                                      realtimeVehicle.mode.toLowerCase() as
                                          | TransportMode
                                          | LegMode
                                          | 'ferry',
                                      IconColorType.DEFAULT,
                                      undefined,
                                  ),
                              }
                            : { backgroundColor: colors.greys.grey30 }
                    }
                >
                    {realtimeVehicle.line.publicCode}
                </div>
            </div>
        </Tooltip>
    )
}

export { RealtimeVehicleTag }
