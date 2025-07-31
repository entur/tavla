import { Button, ButtonGroup, IconButton, NegativeButton } from '@entur/button'
import { CloseIcon, DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import Goat from 'assets/illustrations/Goat.png'
import { SubmitButton } from 'components/Form/SubmitButton'
import Image from 'next/image'
import { TBoardID } from 'types/settings'
import { TTile } from 'types/tile'
import { deleteTile } from '../actions'

function SaveCancelDeleteTileButtonGroup({
    bid,
    tile,
    changed,
    confirmOpen,
    reset,
    setIsOpen,
    setConfirmOpen,
    removeTileFromDemoBoard,
    addToast,
}: {
    bid: TBoardID
    tile: TTile
    changed: boolean
    confirmOpen: boolean
    reset: () => void
    setIsOpen: (isOpen: boolean) => void
    setConfirmOpen: (confirmOpen: boolean) => void
    removeTileFromDemoBoard: (tile: TTile) => void
    addToast: (message: string) => void
}) {
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
                        if (changed) return setConfirmOpen(true)
                        return setIsOpen(false)
                    }}
                >
                    Avbryt
                </Button>
                <div className="sm:hidden">
                    <NegativeButton
                        onClick={async () => {
                            if (bid === 'demo') {
                                removeTileFromDemoBoard(tile)
                            } else {
                                await deleteTile(bid, tile)
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
                onDismiss={reset}
                closeLabel="Avbryt endring"
            >
                <IconButton
                    aria-label="Lukk"
                    onClick={reset}
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
                            onClick={reset}
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
