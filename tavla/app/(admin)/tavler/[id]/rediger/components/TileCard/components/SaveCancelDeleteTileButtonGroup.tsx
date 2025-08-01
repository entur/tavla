import { Button, ButtonGroup, IconButton, NegativeButton } from '@entur/button'
import { CloseIcon, DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import Goat from 'assets/illustrations/Goat.png'
import { TileContext } from 'Board/scenarios/Table/contexts'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useNonNullContext } from 'hooks/useNonNullContext'
import Image from 'next/image'
import { TBoardID } from 'types/settings'
import { TTile } from 'types/tile'
import { deleteTile } from '../actions'

function SaveCancelDeleteTileButtonGroup({
    boardId,
    confirmOpen,
    hasTileChanged,
    resetTile,
    setIsTileOpen,
    setConfirmOpen,
    removeTileFromDemoBoard,
    addToast,
}: {
    boardId: TBoardID
    confirmOpen: boolean
    hasTileChanged: boolean
    resetTile: () => void
    setIsTileOpen: (isOpen: boolean) => void
    setConfirmOpen: (confirmOpen: boolean) => void
    removeTileFromDemoBoard: (tile: TTile) => void
    addToast: (message: string) => void
}) {
    const tile = useNonNullContext(TileContext)
    return (
        <>
            <div className="mt-8 flex flex-col justify-start gap-4 md:flex-row">
                <SubmitButton variant="primary" aria-label="lagre valg">
                    Lagre valg
                </SubmitButton>
                <Button
                    variant="secondary"
                    aria-label="avbryt"
                    type="button"
                    onClick={() => {
                        if (hasTileChanged) return setConfirmOpen(true)
                        return setIsTileOpen(false)
                    }}
                >
                    Avbryt
                </Button>
                <div className="sm:hidden">
                    <NegativeButton
                        onClick={async () => {
                            if (boardId === 'demo') {
                                removeTileFromDemoBoard(tile)
                            } else {
                                await deleteTile(boardId, tile)
                            }
                            addToast(`${tile.name} fjernet!`)
                        }}
                        aria-label="Fjern stoppested"
                        type="button"
                        width="fluid"
                    >
                        <DeleteIcon />
                        Fjern stoppested
                    </NegativeButton>
                </div>
            </div>

            <Modal
                size="small"
                open={confirmOpen}
                onDismiss={resetTile}
                closeLabel="Avbryt endring"
            >
                <IconButton
                    aria-label="Lukk"
                    onClick={resetTile}
                    className="absolute right-4 top-4"
                >
                    <CloseIcon />
                </IconButton>
                <div className="flex flex-col items-center">
                    <Image alt="" src={Goat} className="h-1/2 w-1/2" />
                    <Heading3 margin="bottom" as="h1">
                        Lagre endringer
                    </Heading3>
                    <Paragraph>Du har endringer som ikke er lagret.</Paragraph>

                    <ButtonGroup className="flex flex-row">
                        <SubmitButton
                            variant="primary"
                            width="fluid"
                            form={tile.uuid}
                            aria-label="Lagre endringer"
                        >
                            Lagre
                        </SubmitButton>
                        <Button
                            type="button"
                            variant="secondary"
                            aria-label="Avbryt sletting"
                            onClick={resetTile}
                        >
                            Avbryt
                        </Button>
                    </ButtonGroup>
                </div>
            </Modal>
        </>
    )
}

export { SaveCancelDeleteTileButtonGroup }
