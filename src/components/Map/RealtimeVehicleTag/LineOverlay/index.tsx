import React from 'react'
import { CanvasOverlay } from 'react-map-gl'

interface DrawableRoute {
    points: Array<[number, number]>
    color: string
}

interface Props {
    routes: DrawableRoute[]
}

interface RedrawArgs {
    width: number
    height: number
    ctx: CanvasRenderingContext2D
    project: (point: [number, number]) => [number, number]
}

const LineOverlay = ({ routes }: Props): JSX.Element | null => {
    const redraw = ({ width, height, ctx, project }: RedrawArgs): void => {
        ctx.clearRect(0, 0, width, height)
        ctx.lineWidth = 4
        routes.forEach(({ points, color }: DrawableRoute) => {
            ctx.strokeStyle = color
            ctx.globalAlpha = 0.4
            ctx.beginPath()
            points.forEach((point) => {
                const pixel = project([point[1], point[0]])
                ctx.lineTo(pixel[0], pixel[1])
            })
            ctx.stroke()
        })
    }

    return <CanvasOverlay redraw={redraw} />
}

export default LineOverlay
