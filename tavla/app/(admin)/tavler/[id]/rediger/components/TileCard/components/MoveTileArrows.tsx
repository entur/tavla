import { SecondarySquareButton } from '@entur/button'
import { DownwardIcon, UpwardIcon } from '@entur/icons'

function MoveTileArrows({
    index,
    totalTiles,
    moveItem,
}: {
    index: number
    totalTiles: number
    moveItem: (index: number, direction: string) => void
}) {
    return (
        <div
            className={`flex flex-col ${
                index !== 0 || index !== totalTiles - 1
                    ? 'justify-center gap-2'
                    : 'justify-between'
            }`}
        >
            {index !== 0 && (
                <SecondarySquareButton
                    onClick={() => {
                        moveItem(index, 'up')
                    }}
                    aria-label="Flytt opp"
                    className="ml-2 *:!border-gray-300"
                >
                    <UpwardIcon
                        onClick={() => {
                            moveItem(index, 'up')
                        }}
                        aria-label="Flytt opp"
                    />
                </SecondarySquareButton>
            )}
            {index !== totalTiles - 1 && (
                <SecondarySquareButton
                    onClick={() => {
                        moveItem(index, 'down')
                    }}
                    aria-label="Flytt ned"
                    className="ml-2 *:!border-gray-300"
                >
                    <DownwardIcon />
                </SecondarySquareButton>
            )}
        </div>
    )
}

export { MoveTileArrows }
