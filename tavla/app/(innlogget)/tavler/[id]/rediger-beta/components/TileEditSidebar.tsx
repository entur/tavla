'use client'
import { SmallAlertBox, useToast } from '@entur/alert'
import { Button, NegativeButton } from '@entur/button'
import { BackArrowIcon, DeleteIcon } from '@entur/icons'
import { Heading2 } from '@entur/typography'
import { SubmitButton } from 'app/_components/Form/SubmitButton'
import { SetColumns } from 'app/_components/TileCard/components/SetColumns'
import { SetOffsetDepartureTime } from 'app/_components/TileCard/components/SetOffsetDepartureTime'
import { SetStopPlaceName } from 'app/_components/TileCard/components/SetStopPlaceName'
import { SetVisibleLines } from 'app/_components/TileCard/components/SetVisibleLines'
import { TileContext } from 'app/_components/TileCard/context'
import { useLines } from 'app/_components/TileCard/useLines'
import { isOnlyWhiteSpace } from 'app/(innlogget)/tavler/[id]/utils'
import {
    getFormFeedbackForError,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { startTransition, useActionState, useState } from 'react'
import type {
    BoardDB,
    BoardTileDB,
    LocationDB,
    TileColumnDB,
} from 'src/types/db-types/boards'

function TileEditSidebar({
    tile,
    board,
    address,
    onBack,
    setTiles,
}: {
    tile: BoardTileDB
    board: BoardDB
    address?: LocationDB
    onBack: () => void
    setTiles: (tiles: BoardDB['tiles']) => void
}) {
    const { addToast } = useToast()
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [changedFields, setChangedFields] = useState<Set<string>>(new Set())

    const onFieldChanged = (field: string) => {
        setChangedFields((prev) => new Set(prev).add(field))
        setHasUnsavedChanges(true)
    }

    const quays = useLines(tile)

    const quaysWithFilteredLines = (quays ?? [])
        .map((q) => ({ ...q }))
        .filter((q) => q.lines.length > 0)

    const submit = async (
        _prevState: TFormFeedback | undefined,
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

        const allSelected = quayLineKeys.length === count

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

        if (board.isCombinedTiles) {
            columns =
                tile.columns ??
                (['line', 'destination', 'time'] as TileColumnDB[])
        }

        const newTile: BoardTileDB = {
            ...tile,
            columns,
            quays: newQuays,
            ...(address && {
                walkingDistance: {
                    distance: tile.walkingDistance?.distance,
                },
            }),
            offset: Number(offset) || undefined,
            displayName: displayName.substring(0, 50) || undefined,
        }

        const updatedTiles = board.tiles.map((t) =>
            t.uuid === newTile.uuid ? newTile : t,
        )
        setTiles(updatedTiles)
        setHasUnsavedChanges(false)
        setChangedFields(new Set())
        onBack()
    }

    const [state, runAction] = useActionState(submit, undefined)

    const handleDelete = () => {
        const remaining = board.tiles.filter((t) => t.uuid !== tile.uuid)
        setTiles(remaining)
        addToast(`${tile.name} fjernet!`)
        onBack()
    }

    const handleBack = () => {
        if (hasUnsavedChanges) return setConfirmOpen(true)
        onBack()
    }

    if (!quays) return null

    return (
        <TileContext.Provider value={tile}>
            <div className="flex h-full flex-col text-sm [&_h3]:text-base [&_h4]:text-sm">
                <div className="flex-1 overflow-y-auto px-6 py-8 [&_h4]:mb-1 [&_h4]:mt-0">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="mb-6 flex items-center gap-2 text-blue-dark opacity-70 hover:opacity-100"
                        aria-label="Gå tilbake"
                    >
                        <BackArrowIcon />
                        Tilbake
                    </button>

                    <Heading2 margin="bottom" className="!text-2xl">
                        {tile.displayName ?? tile.name}
                    </Heading2>

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
                        className="flex flex-col gap-6"
                    >
                        <SetStopPlaceName
                            state={state}
                            trackingLocation="board_page"
                            onFieldChanged={onFieldChanged}
                        />
                        <SetOffsetDepartureTime
                            address={address}
                            trackingLocation="board_page"
                            onFieldChanged={onFieldChanged}
                        />
                        {!board.isCombinedTiles && (
                            <SetColumns
                                isCombined={false}
                                isArrivals={board.isArrivals ?? false}
                                trackingLocation="board_page"
                                onFieldChanged={onFieldChanged}
                            />
                        )}
                        <SetVisibleLines
                            quays={quaysWithFilteredLines}
                            trackingLocation="board_page"
                            onFieldChanged={onFieldChanged}
                        />
                        {state?.feedback && (
                            <SmallAlertBox variant="warning" className="w-fit">
                                {state.feedback}
                            </SmallAlertBox>
                        )}
                    </form>
                </div>

                <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-primary bg-tintLight px-6 py-4">
                    <div className="flex gap-3">
                        <SubmitButton
                            form={tile.uuid}
                            variant="primary"
                            aria-label="Lagre endringer"
                        >
                            Lagre endringer
                        </SubmitButton>
                        <Button
                            variant="secondary"
                            type="button"
                            aria-label="Avbryt"
                            onClick={handleBack}
                        >
                            Avbryt
                        </Button>
                    </div>
                    <NegativeButton
                        type="button"
                        aria-label="Slett stoppested"
                        onClick={handleDelete}
                    >
                        <DeleteIcon aria-hidden />
                        Slett
                    </NegativeButton>
                </div>

                {confirmOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-lg">
                            <p className="font-semibold">
                                Du har ulagrede endringer. Vil du forkaste dem?
                            </p>
                            <div className="flex gap-3">
                                <SubmitButton
                                    form={tile.uuid}
                                    variant="primary"
                                    aria-label="Lagre og gå tilbake"
                                    onClick={() => setConfirmOpen(false)}
                                >
                                    Lagre
                                </SubmitButton>
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => {
                                        setConfirmOpen(false)
                                        onBack()
                                    }}
                                >
                                    Forkast
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TileContext.Provider>
    )
}

export { TileEditSidebar }
