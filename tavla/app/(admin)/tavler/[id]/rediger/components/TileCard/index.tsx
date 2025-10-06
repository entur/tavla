'use client'
import { useToast } from '@entur/alert'
import { BaseExpand } from '@entur/expand'
import { Heading3 } from '@entur/typography'
import { OLD_LINE_IDS } from 'app/(admin)/tavler/[id]/rediger/compatibility'
import { isOnlyWhiteSpace } from 'app/(admin)/tavler/[id]/utils'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { TileContext } from 'Board/scenarios/Table/contexts'
import { TransportIcon } from 'components/TransportIcon'
import { uniqBy } from 'lodash'
import {
    Dispatch,
    SetStateAction,
    startTransition,
    useActionState,
    useState,
} from 'react'
import { DEFAULT_COLUMNS, TColumn } from 'types/column'
import { TLocation } from 'types/meta'
import { TBoard, TBoardID } from 'types/settings'
import { TTile } from 'types/tile'
import { deleteTile, saveTile } from './actions'
import { EditRemoveTileButtonGroup } from './components/EditRemoveTileButtonGroup'
import { SaveCancelDeleteTileButtonGroup } from './components/SaveCancelDeleteTileButtonGroup'
import { SetColumns } from './components/SetColumns'
import { SetOffsetDepartureTime } from './components/SetOffsetDepartureTime'
import { SetStopPlaceName } from './components/SetStopPlaceName'
import { SetVisibleLines } from './components/SetVisibleLines'
import { TileArrows } from './components/TileArrows'
import { useLines } from './useLines'

function TileCard({
    bid,
    tile,
    index,
    address,
    demoBoard,
    totalTiles,
    isCombined,
    moveItem,
    setDemoBoard,
}: {
    bid: TBoardID
    tile: TTile
    index: number
    address?: TLocation
    demoBoard?: TBoard
    totalTiles: number
    isCombined: boolean
    moveItem: (index: number, direction: string) => void
    setDemoBoard?: Dispatch<SetStateAction<TBoard>>
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const { addToast } = useToast()

    const submit = async (
        prevState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        let columns = data.getAll('columns') as TColumn[]
        data.delete('columns')
        const count = data.get('count') as number | null
        data.delete('count')
        const offset = data.get('offset') as number | null
        data.delete('offset')
        const displayName = data.get('displayName') as string
        data.delete('displayName')

        if (isOnlyWhiteSpace(displayName)) {
            return getFormFeedbackForError('board/tiles-name-missing')
        }

        let lines: string[] = []
        for (const line of data.values()) {
            lines.push(line as string)
        }

        // If the length of lines equals all the lines, we don't want to include any
        lines = lines.length == count ? [] : lines

        if (lines.length === 0 && count !== null && count > 0) {
            return getFormFeedbackForError('board/tiles-no-lines-selected')
        }

        if (isCombined) {
            columns = tile.columns ?? DEFAULT_COLUMNS
        }

        const newTile = {
            ...tile,
            columns,
            whitelistedLines: lines,
            ...(address && {
                walkingDistance: {
                    distance: tile.walkingDistance?.distance,
                },
            }),
            offset: Number(offset) || undefined,
            displayName: displayName.substring(0, 50) || undefined,
        } as TTile

        try {
            if (bid === 'demo') {
                saveTileToDemoBoard(newTile)
            } else {
                await saveTile(bid, newTile)
            }
            reset()
        } catch {
            return getFormFeedbackForError('board/tiles-save-failed')
        }
    }

    const [state, runAction] = useActionState(submit, undefined)

    const reset = () => {
        setConfirmOpen(false)
        setHasUnsavedChanges(false)
        setIsOpen(false)
    }

    let lines = useLines(tile)

    if (!lines)
        return (
            <div className="flex items-center justify-between rounded bg-blue20 p-4">
                Laster...
            </div>
        )

    // TODO: remove when old lines no longer return any data (2025)
    lines = lines.filter((line) => !OLD_LINE_IDS.includes(line.id))

    const uniqLines = uniqBy(lines, 'id')

    const transportModes = uniqBy(uniqLines, 'transportMode')
        .map((l) => l.transportMode)
        .sort()

    const uniqTransportModeIcons = transportModes
        .filter((tm) => !(tm === 'coach' && transportModes.includes('bus')))
        .map((tm) => <TransportIcon transportMode={tm} key={tm} />)

    const saveTileToDemoBoard = (newTile: TTile) => {
        if (!demoBoard) return null
        const oldTileIndex = demoBoard.tiles.findIndex(
            (tile) => tile.uuid == newTile.uuid,
        )
        if (oldTileIndex === -1) return null
        demoBoard.tiles[oldTileIndex] = newTile
        if (setDemoBoard) setDemoBoard({ ...demoBoard })
    }

    const deleteTileDemoBoard = () => {
        if (!demoBoard) return null

        const remainingTiles = demoBoard.tiles.filter(
            (t) => t.uuid !== tile.uuid,
        )
        if (setDemoBoard) setDemoBoard({ ...demoBoard, tiles: remainingTiles })

        addToast(`${tile.name} fjernet!`)
    }

    return (
        <div>
            <TileContext.Provider value={tile}>
                <div className="flex flex-row">
                    <div
                        className={`flex w-full items-center justify-between bg-blue20 px-6 py-4 ${
                            isOpen ? 'rounded-t' : 'rounded'
                        }`}
                    >
                        <div className="flex flex-row items-center gap-4">
                            <Heading3 margin="none">
                                {tile.displayName ?? tile.name}
                            </Heading3>
                            <div className="hidden h-8 flex-row gap-4 sm:flex">
                                {uniqTransportModeIcons}
                            </div>
                        </div>
                        <EditRemoveTileButtonGroup
                            hasTileChanged={hasUnsavedChanges}
                            isTileOpen={isOpen}
                            setIsTileOpen={setIsOpen}
                            setConfirmOpen={setConfirmOpen}
                            deleteTile={() =>
                                bid === 'demo'
                                    ? deleteTileDemoBoard()
                                    : deleteTile(bid, tile).then(() => {
                                          addToast(`${tile.name} fjernet!`)
                                      })
                            }
                        />
                    </div>
                    <TileArrows
                        index={index}
                        totalTiles={totalTiles}
                        moveItem={moveItem}
                    />
                </div>

                <BaseExpand open={isOpen}>
                    <div
                        className={`mr-14 bg-blue10 px-6 py-4 ${
                            totalTiles == 1 && 'w-full'
                        } rounded-b`}
                    >
                        <form
                            id={tile.uuid}
                            onSubmit={(e) => {
                                e.preventDefault()
                                const fd = new FormData(e.currentTarget)
                                startTransition(() => {
                                    runAction(fd)
                                })
                            }}
                            onInput={() => setHasUnsavedChanges(true)}
                        >
                            <SetStopPlaceName
                                state={state}
                                isCombined={isCombined}
                            />
                            <SetOffsetDepartureTime address={address} />
                            <SetColumns isCombined={isCombined} />
                            <SetVisibleLines
                                uniqLines={uniqLines}
                                transportModes={transportModes}
                            />
                            <SaveCancelDeleteTileButtonGroup
                                confirmOpen={confirmOpen}
                                hasTileChanged={hasUnsavedChanges}
                                resetTile={reset}
                                setIsTileOpen={setIsOpen}
                                setConfirmOpen={setConfirmOpen}
                                validation={state}
                                deleteTile={() =>
                                    bid === 'demo'
                                        ? deleteTileDemoBoard()
                                        : deleteTile(bid, tile).then(() => {
                                              addToast(`${tile.name} fjernet!`)
                                          })
                                }
                            />
                        </form>
                    </div>
                </BaseExpand>
            </TileContext.Provider>
        </div>
    )
}

export { TileCard }
