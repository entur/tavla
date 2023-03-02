import React, { useMemo } from 'react'
import polyline from 'google-polyline'
import { useSettings } from 'settings/SettingsProvider'
import { DrawableRoute, Line } from 'src/types'
import { getIconColor } from 'utils/icon'
import { TransportMode } from 'graphql-generated/journey-planner-v3'
import { useUniqueLines } from 'hooks/use-unique-lines/useUniqueLines'
import { LineOverlay } from './LineOverlay'

function PermanentlyDrawnRoutes() {
    const [settings] = useSettings()
    const { uniqueLines } = useUniqueLines()

    const routesToDraw = useMemo(
        () =>
            settings.permanentlyVisibleRoutesInMap
                .filter(
                    ({ lineRef }: DrawableRoute) =>
                        uniqueLines
                            .map(({ id }: Line) => id)
                            .includes(lineRef) &&
                        !settings.hiddenRealtimeDataLineRefs.includes(lineRef),
                )
                .map(({ pointsOnLink, mode }: DrawableRoute) => ({
                    points: polyline.decode(pointsOnLink),
                    color: getIconColor(
                        mode.toLowerCase() as TransportMode,
                        'default',
                    ),
                })),
        [
            settings.permanentlyVisibleRoutesInMap,
            settings.hiddenRealtimeDataLineRefs,
            uniqueLines,
        ],
    )

    if (!settings.showRoutesInMap || settings.hideRealtimeData) {
        return null
    }

    return <LineOverlay routes={routesToDraw} />
}

export { PermanentlyDrawnRoutes }
