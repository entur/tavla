// Use this to scale the race track.
const ZOOM = 1

const TICKS = [-1, 0, 1, 2, 3, 4, 5, 10, 15, 20, 30, 60]
const negativeTickOffset = Math.abs(
    TICKS.filter((tick) => tick < 0).reduce((a, b) => a + b, 0),
)

function competitorPosition(waitTime: number): number {
    return ZOOM * (waitTime + negativeTickOffset * 60)
}

export { TICKS, ZOOM, competitorPosition }
