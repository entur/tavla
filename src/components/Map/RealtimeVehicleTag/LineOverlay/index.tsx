import React from 'react'
import { CanvasOverlay } from 'react-map-gl'

interface Props {
    points: Array<[number, number]>
    color: string
}

interface RedrawArgs {
    width: number
    height: number
    ctx: CanvasRenderingContext2D
    project: (point: [number, number]) => [number, number]
}

const LineOverlay = ({ points, color }: Props): JSX.Element | null => {
    const redraw = ({ width, height, ctx, project }: RedrawArgs): void => {
        ctx.clearRect(0, 0, width, height)
        ctx.lineWidth = 4
        ctx.strokeStyle = color
        ctx.globalAlpha = 0.4
        ctx.beginPath()
        points.forEach((point) => {
            const pixel = project([point[1], point[0]])
            ctx.lineTo(pixel[0], pixel[1])
        })
        ctx.stroke()
    }

    return <CanvasOverlay redraw={redraw} />
}

export default LineOverlay
