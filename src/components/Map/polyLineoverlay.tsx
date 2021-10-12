import React from 'react'
import { CanvasOverlay } from 'react-map-gl'

interface Props {
    points: Array<[number, number]>
    color?: string
    lineWidth?: number
}

interface lol {
    width: number
    height: number
    ctx: CanvasRenderingContext2D
    isDragging: boolean
    project: (point: [number, number]) => [number, number]
}

export const PolylineOverlay = ({
    points,
    color = 'red',
    lineWidth = 2,
}: Props): JSX.Element | null => {
    const redraw = ({ width, height, ctx, project }: lol): void => {
        ctx.clearRect(0, 0, width, height)
        ctx.globalCompositeOperation = 'lighter'
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = color
        ctx.beginPath()
        points.forEach((point) => {
            const pixel = project([point[1], point[0]])
            ctx.lineTo(pixel[0], pixel[1])
        })
        ctx.stroke()
    }

    return <CanvasOverlay redraw={redraw} />
}
