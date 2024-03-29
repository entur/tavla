import React, { useCallback } from 'react'
import { CanvasOverlay } from 'react-map-gl'

type RouteToDraw = {
    points: Array<[number, number]>
    color: string
}
type RedrawArgs = {
    width: number
    height: number
    ctx: CanvasRenderingContext2D
    project: (point: [number, number]) => [number, number]
}

function LineOverlay({
    routes,
}: {
    routes: RouteToDraw[]
}): JSX.Element | null {
    const redraw = useCallback(
        ({ width, height, ctx, project }: RedrawArgs): void => {
            ctx.clearRect(0, 0, width, height)
            ctx.lineWidth = 4
            routes.forEach(({ points, color }: RouteToDraw) => {
                ctx.strokeStyle = color
                ctx.globalAlpha = 0.4
                ctx.beginPath()
                points.forEach((point) => {
                    const pixel = project([point[1], point[0]])
                    ctx.lineTo(pixel[0], pixel[1])
                })
                ctx.stroke()
            })
        },
        [routes],
    )

    return <CanvasOverlay redraw={redraw} />
}

export { LineOverlay }
