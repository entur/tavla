'use client'
import { useToast } from '@entur/alert'
import { BaseExpand } from '@entur/expand'
import { Heading3 } from '@entur/typography'
import { DEFAULT_COLUMNS } from 'app/(admin)/components/TileSelector/utils'
import { TransportIcon } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/TransportIcon'
import { TileContext } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/context'
import { isOnlyWhiteSpace } from 'app/(admin)/tavler/[id]/utils'
import { TFormFeedback, getFormFeedbackForError } from 'app/(admin)/utils'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { uniqBy } from 'lodash'
import {
    Dispatch,
    SetStateAction,
    startTransition,
    useActionState,
    useState,
} from 'react'
import {
    BoardDB,
    BoardTileDB,
    LocationDB,
    TileColumnDB,
} from 'src/types/db-types/boards'
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
    bid: BoardDB['id']
    tile: BoardTileDB
    index: number
    address?: LocationDB
    demoBoard?: BoardDB
    totalTiles: number
    isCombined: boolean
    moveItem: (index: number, direction: string) => void
    setDemoBoard?: Dispatch<SetStateAction<BoardDB>>
}) {
    const posthog = usePosthogTracking()

    const [isOpen, setIsOpen] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const { addToast } = useToast()

    const submit = async (
        prevState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        let columns = data.getAll('columns') as TileColumnDB[]
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

        const quayLineKeys: string[] = []
        for (const value of data.values()) {
            quayLineKeys.push(value as string)
        }

        if (quayLineKeys.length === 0 && count !== null && count > 0) {
            return getFormFeedbackForError('board/tiles-no-lines-selected')
        }

        const allSelected = quayLineKeys.length == count

        const newQuays = allSelected
            ? []
            : quaysWithFilteredLines
                  .map((q) => ({
                      id: q.id,
                      whitelistedLines: q.lines
                          .filter((l) =>
                              quayLineKeys.includes(`${q.id}||${l.id}`),
                          )
                          .map((l) => l.id),
                  }))
                  .filter((q) => q.whitelistedLines.length > 0)

        const lines = allSelected
            ? []
            : Array.from(
                  new Set(
                      quayLineKeys
                          .map((key) => key.split('||')[1])
                          .filter((key) => key !== undefined),
                  ),
              )

        if (isCombined) {
            columns = tile.columns ?? DEFAULT_COLUMNS
        }

        const newTile: BoardTileDB = {
            ...tile,
            columns,
            whitelistedLines: lines,
            quays: newQuays,
            ...(address && {
                walkingDistance: {
                    distance: tile.walkingDistance?.distance,
                },
            }),
            offset: Number(offset) || undefined,
            displayName: displayName.substring(0, 50) || undefined,
        }

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

    const quays = useLines(tile)

    if (!quays)
        return (
            <div className="flex items-center justify-between rounded p-4">
                Laster...
            </div>
        )

    const quaysWithFilteredLines = quays
        .map((q) => ({
            ...q,
        }))
        .filter((q) => q.lines.length > 0)

    // Flatten lines for other components if needed, or update components to use Quays
    const allLines = quaysWithFilteredLines.flatMap((q) =>
        q.lines.map((l) => ({
            ...l,
            quayName: q.name,
            quayPublicCode: q.publicCode,
        })),
    )

    const uniqLines = uniqBy(allLines, 'id')

    const transportModes = uniqBy(uniqLines, 'transportMode')
        .map((l) => l.transportMode)
        .sort()

    const uniqTransportModeIcons = transportModes
        .filter((tm) => !(tm === 'coach' && transportModes.includes('bus')))
        .map((tm) => <TransportIcon transportMode={tm} key={tm} />)

    const saveTileToDemoBoard = (newTile: BoardTileDB) => {
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

    const handleSetIsTileOpen = (open: boolean) => {
        setIsOpen(open)
    }

    const handleDeleteTile = () => {
        posthog.capture('stop_place_deleted', {
            location: bid === 'demo' ? 'demo_page' : 'board_page',
        })

        if (bid === 'demo') {
            deleteTileDemoBoard()
        } else {
            deleteTile(bid, tile).then(() => {
                addToast(`${tile.name} fjernet!`)
            })
        }
    }

    const trackingLocation = bid === 'demo' ? 'demo_page' : 'board_page'

    return (
        <div>
            <TileContext.Provider value={tile}>
                <div className="flex flex-row">
                    <div
                        className={`flex w-full items-center justify-between bg-white px-6 py-4 ${
                            isOpen ? 'rounded-t' : 'rounded'
                        }`}
                    >
                        <div className="flex flex-row items-center gap-4">
                            <Heading3 margin="none">
                                {tile.displayName ?? tile.name}
                            </Heading3>
                            <div
                                className="hidden h-8 flex-row gap-4 sm:flex"
                                aria-label="Transportmidler fra dette stoppestedet: "
                            >
                                {uniqTransportModeIcons}
                            </div>
                        </div>
                        <EditRemoveTileButtonGroup
                            hasTileChanged={hasUnsavedChanges}
                            isTileOpen={isOpen}
                            setIsTileOpen={handleSetIsTileOpen}
                            setConfirmOpen={setConfirmOpen}
                            deleteTile={handleDeleteTile}
                            trackingLocation={
                                bid === 'demo' ? 'demo_page' : 'board_page'
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
                        className={`mr-14 border-t-2 bg-white px-6 py-4 ${
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
                                trackingLocation={trackingLocation}
                            />
                            <SetOffsetDepartureTime
                                address={address}
                                trackingLocation={trackingLocation}
                            />
                            <SetColumns
                                isCombined={isCombined}
                                trackingLocation={trackingLocation}
                            />
                            <SetVisibleLines
                                quays={quaysWithFilteredLines}
                                allLines={uniqLines}
                                trackingLocation={trackingLocation}
                            />
                            <SaveCancelDeleteTileButtonGroup
                                confirmOpen={confirmOpen}
                                hasTileChanged={hasUnsavedChanges}
                                resetTile={reset}
                                setIsTileOpen={handleSetIsTileOpen}
                                setConfirmOpen={setConfirmOpen}
                                validation={state}
                                deleteTile={handleDeleteTile}
                                trackingLocation={trackingLocation}
                            />
                        </form>
                    </div>
                </BaseExpand>
            </TileContext.Provider>
        </div>
    )
}

export { TileCard }
